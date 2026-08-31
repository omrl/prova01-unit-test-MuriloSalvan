const CarrinhoCompras = require("../src/carrinhoCompras");

describe("CarrinhoCompras", () => {
  let carrinho;

  beforeEach(() => {
    carrinho = new CarrinhoCompras();
  });

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

  describe("totalItens e quantidadeDeProdutos", () => {
    test("deve contar unidades e produtos distintos", () => {
      carrinho.adicionarItem("Mouse", 50, 2);
      carrinho.adicionarItem("Teclado", 150, 3);
      expect(carrinho.totalItens()).toBe(5);
      expect(carrinho.quantidadeDeProdutos()).toBe(2);
    });

    test("deve retornar zero no carrinho vazio", () => {
      expect(carrinho.totalItens()).toBe(0);
      expect(carrinho.quantidadeDeProdutos()).toBe(0);
    });
  });

  describe("subtotal", () => {
    test("deve somar preço x quantidade", () => {
      carrinho.adicionarItem("Mouse", 50, 2);
      carrinho.adicionarItem("Teclado", 150, 1);
      expect(carrinho.subtotal()).toBe(250);
    });

    test("deve arredondar para duas casas decimais", () => {
      carrinho.adicionarItem("Caneta", 0.1, 3);
      expect(carrinho.subtotal()).toBe(0.3);
    });

    test("deve retornar zero no carrinho vazio", () => {
      expect(carrinho.subtotal()).toBe(0);
    });
  });

});
