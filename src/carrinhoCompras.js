/** Arredonda um valor monetário para duas casas decimais */
function arredondar(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

const CUPONS = {
  PROMO10: 0.1,
  BLACK20: 0.2,
  METADE: 0.5,
};

const VALOR_FRETE = 15;

class CarrinhoCompras {
  constructor(limiteFreteGratis = 200) {
    this.itens = [];
    this.cupom = null;
    this.limiteFreteGratis = limiteFreteGratis;
  }

  /** 1. Adiciona um item ao carrinho (soma a quantidade se já existir) */
  adicionarItem(nome, preco, quantidade = 1) {
    if (typeof nome !== "string" || nome.trim() === "") {
      throw new Error("O nome do item é obrigatório");
    }
    if (typeof preco !== "number" || Number.isNaN(preco) || preco <= 0) {
      throw new Error("O preço deve ser maior que zero");
    }
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new Error("A quantidade deve ser um inteiro positivo");
    }

    const existente = this.buscarItem(nome);
    if (existente) {
      existente.quantidade += quantidade;
      return existente;
    }

    const item = { nome: nome.trim(), preco, quantidade };
    this.itens.push(item);
    return item;
  }

  /** 2. Remove um item do carrinho e o devolve */
  removerItem(nome) {
    const indice = this.itens.findIndex((item) => item.nome === nome);
    if (indice === -1) {
      throw new Error(`Item não encontrado: ${nome}`);
    }
    return this.itens.splice(indice, 1)[0];
  }

  /** 3. Atualiza a quantidade de um item (quantidade 0 remove o item) */
  atualizarQuantidade(nome, quantidade) {
    const item = this.buscarItem(nome);
    if (!item) {
      throw new Error(`Item não encontrado: ${nome}`);
    }
    if (!Number.isInteger(quantidade) || quantidade < 0) {
      throw new Error("A quantidade deve ser um inteiro não negativo");
    }
    if (quantidade === 0) {
      this.removerItem(nome);
      return null;
    }
    item.quantidade = quantidade;
    return item;
  }

  /** 4. Busca um item pelo nome (null quando não existe) */
  buscarItem(nome) {
    return this.itens.find((item) => item.nome === nome) || null;
  }

  /** 5. Informa se um item está no carrinho */
  contemItem(nome) {
    return this.buscarItem(nome) !== null;
  }

  /** 6. Soma das quantidades de todos os itens */
  totalItens() {
    return this.itens.reduce((total, item) => total + item.quantidade, 0);
  }

  /** 7. Quantidade de produtos distintos no carrinho */
  quantidadeDeProdutos() {
    return this.itens.length;
  }

  /** 8. Soma de preço x quantidade de todos os itens */
  subtotal() {
    const total = this.itens.reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0,
    );
    return arredondar(total);
  }

  /** 9. Aplica um cupom de desconto válido */
  aplicarCupom(codigo) {
    if (typeof codigo !== "string") {
      throw new Error("O código do cupom é obrigatório");
    }
    const chave = codigo.trim().toUpperCase();
    if (!Object.prototype.hasOwnProperty.call(CUPONS, chave)) {
      throw new Error(`Cupom inválido: ${codigo}`);
    }
    this.cupom = chave;
    return chave;
  }

  /** 10. Remove o cupom aplicado e devolve o código anterior */
  removerCupom() {
    const anterior = this.cupom;
    this.cupom = null;
    return anterior;
  }

  /** 11. Valor em reais do desconto do cupom aplicado */
  valorDesconto() {
    if (!this.cupom) return 0;
    return arredondar(this.subtotal() * CUPONS[this.cupom]);
  }

  /** 12. Frete: grátis com carrinho vazio ou acima do limite */
  calcularFrete() {
    if (this.estaVazio()) return 0;
    const valorComDesconto = this.subtotal() - this.valorDesconto();
    return valorComDesconto >= this.limiteFreteGratis ? 0 : VALOR_FRETE;
  }

  /** 13. Valor final: subtotal - desconto + frete */
  total() {
    return arredondar(
      this.subtotal() - this.valorDesconto() + this.calcularFrete(),
    );
  }

  /** 14. Cópia dos itens do carrinho (protege o estado interno) */
  listarItens() {
    return this.itens.map((item) => ({ ...item }));
  }

  /** 15. Item de maior preço unitário (null quando vazio) */
  itemMaisCaro() {
    if (this.estaVazio()) return null;
    return this.itens.reduce((maior, item) =>
      item.preco > maior.preco ? item : maior,
    );
  }

  /** 16. Itens ordenados por preço unitário ("asc" ou "desc") */
  ordenarPorPreco(ordem = "asc") {
    if (ordem !== "asc" && ordem !== "desc") {
      throw new Error('A ordem deve ser "asc" ou "desc"');
    }
    return this.listarItens().sort((a, b) =>
      ordem === "asc" ? a.preco - b.preco : b.preco - a.preco,
    );
  }

  /** 17. Itens dentro de uma faixa de preço (limites inclusivos) */
  filtrarPorFaixaDePreco(min, max) {
    if (typeof min !== "number" || typeof max !== "number") {
      throw new Error("Os limites da faixa devem ser números");
    }
    if (min > max) {
      throw new Error("O valor mínimo não pode ser maior que o máximo");
    }
    return this.listarItens().filter(
      (item) => item.preco >= min && item.preco <= max,
    );
  }

  /** 18. Esvazia o carrinho e remove o cupom, devolvendo quantos itens saíram */
  esvaziar() {
    const removidos = this.itens.length;
    this.itens = [];
    this.cupom = null;
    return removidos;
  }

  /** 19. Informa se o carrinho está vazio */
  estaVazio() {
    return this.itens.length === 0;
  }

  /** 20. Resumo completo do carrinho */
  resumo() {
    return {
      produtos: this.quantidadeDeProdutos(),
      itens: this.totalItens(),
      subtotal: this.subtotal(),
      cupom: this.cupom,
      desconto: this.valorDesconto(),
      frete: this.calcularFrete(),
      total: this.total(),
    };
  }
}

module.exports = CarrinhoCompras;
