import Invoice from './invoice.model.js';

export const createInvoice = async (req, res) => {
  try {
    const inv = new Invoice(req.body);
    await inv.save();
    return res.status(201).json({ success: true, invoice: inv });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const getInvoices = async (_req, res) => {
  try {
    const invoices = await Invoice.find();
    return res.json({ success: true, invoices });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const inv = await Invoice.findById(req.params.id);
    if (!inv) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    return res.json({ success: true, invoice: inv });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const createInvoiceFromOrder = async (order) => {
  const inv = new Invoice({
    orderId: order._id,
    restaurantId: order.restaurantId,
    customer: order.customer || {},
    items: (order.items || []).map(i => ({
      menuId: i.menuId,
      name: i.name || '',
      price: i.price,
      quantity: i.quantity
    })),
    total: order.total
  });
  return inv.save();
};
