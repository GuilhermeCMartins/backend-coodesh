class TransactionType {
  Id: number;
  Description: string;
  Inbound: boolean;

  constructor(id: number, description: string, inbound: boolean) {
    this.Id = id;
    this.Description = description;
    this.Inbound = inbound;
  }

  static getPredefinedTypes(): TransactionType[] {
    return [
      new TransactionType(1, "Venda produtor", true),
      new TransactionType(2, "Venda afiliado", true),
      new TransactionType(3, "Comissão paga", false),
      new TransactionType(4, "Comissão recebida", true),
    ];
  }
}

export { TransactionType };
