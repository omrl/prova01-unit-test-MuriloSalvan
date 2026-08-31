const CarrinhoCompras = require("../src/carrinhoCompras");

describe("CarrinhoCompras", () => {
  let carrinho;

  beforeEach(() => {
    carrinho = new CarrinhoCompras();
  });

  // 1. adicionarItem: inclui o item, soma a quantidade se ele ja existe e valida nome, preco e quantidade
  describe("adicionarItem", () => {
    test("deve adicionar um item novo", () => {
      const item = carrinho.adicionarItem("Teclado", 150, 2);
      expect(item).toEqual({ nome: "Teclado", preco: 150, quantidade: 2 });
      expect(carrinho.quantidadeDeProdutos()).toBe(1);
    });

    test("deve usar quantidade 1 como padrão", () => {
      expect(carrinho.adicionarItem("Mouse", 50).quantidade).toBe(1);
    });

    test("deve somar a quantidade quando o item já existe", () => {
      carrinho.adicionarItem("Mouse", 50, 2);
      carrinho.adicionarItem("Mouse", 50, 3);
      expect(carrinho.buscarItem("Mouse").quantidade).toBe(5);
      expect(carrinho.quantidadeDeProdutos()).toBe(1);
    });

    test("deve lançar erro para nome inválido", () => {
      expect(() => carrinho.adicionarItem("", 10)).toThrow(
        "O nome do item é obrigatório",
      );
      expect(() => carrinho.adicionarItem("   ", 10)).toThrow();
      expect(() => carrinho.adicionarItem(null, 10)).toThrow();
    });

    test("deve lançar erro para preço inválido", () => {
      expect(() => carrinho.adicionarItem("Mouse", 0)).toThrow(
        "O preço deve ser maior que zero",
      );
      expect(() => carrinho.adicionarItem("Mouse", -5)).toThrow();
      expect(() => carrinho.adicionarItem("Mouse", "10")).toThrow();
      expect(() => carrinho.adicionarItem("Mouse", NaN)).toThrow();
    });

    test("deve lançar erro para quantidade inválida", () => {
      expect(() => carrinho.adicionarItem("Mouse", 10, 0)).toThrow(
        "A quantidade deve ser um inteiro positivo",
      );
      expect(() => carrinho.adicionarItem("Mouse", 10, 1.5)).toThrow();
      expect(() => carrinho.adicionarItem("Mouse", 10, -2)).toThrow();
    });
  });

  // 2. removerItem: retira o item do carrinho e o devolve, ou lanca erro se ele nao existir
  describe("removerItem", () => {
    test("deve remover e devolver o item", () => {
      carrinho.adicionarItem("Mouse", 50);
      const removido = carrinho.removerItem("Mouse");
      expect(removido.nome).toBe("Mouse");
      expect(carrinho.estaVazio()).toBe(true);
    });

    test("deve lançar erro quando o item não existe", () => {
      expect(() => carrinho.removerItem("Fone")).toThrow(
        "Item não encontrado: Fone",
      );
    });
  });

  // 3. atualizarQuantidade: troca a quantidade do item; quantidade zero remove o item do carrinho
  describe("atualizarQuantidade", () => {
    beforeEach(() => carrinho.adicionarItem("Mouse", 50, 2));

    test("deve atualizar a quantidade do item", () => {
      expect(carrinho.atualizarQuantidade("Mouse", 7).quantidade).toBe(7);
    });

    test("deve remover o item quando a quantidade for zero", () => {
      expect(carrinho.atualizarQuantidade("Mouse", 0)).toBeNull();
      expect(carrinho.contemItem("Mouse")).toBe(false);
    });

    test("deve lançar erro quando o item não existe", () => {
      expect(() => carrinho.atualizarQuantidade("Fone", 1)).toThrow(
        "Item não encontrado: Fone",
      );
    });

    test("deve lançar erro para quantidade inválida", () => {
      expect(() => carrinho.atualizarQuantidade("Mouse", -1)).toThrow(
        "A quantidade deve ser um inteiro não negativo",
      );
      expect(() => carrinho.atualizarQuantidade("Mouse", 2.5)).toThrow();
    });
  });

  // 4 e 5. buscarItem/contemItem: localizam um item pelo nome (null/false quando nao existe)
  describe("buscarItem e contemItem", () => {
    test("deve encontrar um item existente", () => {
      carrinho.adicionarItem("Mouse", 50);
      expect(carrinho.buscarItem("Mouse")).toMatchObject({ preco: 50 });
      expect(carrinho.contemItem("Mouse")).toBe(true);
    });

    test("deve retornar null e false quando não existe", () => {
      expect(carrinho.buscarItem("Fone")).toBeNull();
      expect(carrinho.contemItem("Fone")).toBe(false);
    });
  });
});
