import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const expenses = await prisma.expense.findMany({ orderBy: { date: 'desc' } });
        res.status(200).json(expenses);
      } catch (error) {
        res.status(500).json({ error: 'Failed to load expenses' });
      }
      break;
    case 'POST':
      try {
        const { date, desc, amount } = req.body;
        const expense = await prisma.expense.create({
          data: {
            date: new Date(date),
            desc,
            amount: parseFloat(amount),
          },
        });
        res.status(201).json(expense);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create expense' });
      }
      break;
    case 'PUT':
      try {
        const { id, date, desc, amount } = req.body;
        const expense = await prisma.expense.update({
          where: { id: parseInt(id, 10) },
          data: {
            date: new Date(date),
            desc,
            amount: parseFloat(amount),
          },
        });
        res.status(200).json(expense);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update expense' });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.query;
        await prisma.expense.delete({ where: { id: parseInt(id, 10) } });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
