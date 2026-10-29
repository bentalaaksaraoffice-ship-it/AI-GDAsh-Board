import React, { useState, useEffect, useMemo } from 'react';
import {
  Author,
  Book,
  BookSale,
  FinancialTransaction,
  Lead,
  LeadStatus,
  PublicationStatus,
  PublishingOrder,
  UserRole,
} from './types';
import {
  INITIAL_AUTHORS,
  INITIAL_BOOKS,
  INITIAL_GENRES,
  INITIAL_LEADS,
  INITIAL_ORDERS,
  INITIAL_SALES,
  INITIAL_TRANSACTIONS,
} from './data/initialData';
import { computeDynamicMonthlyGrowth } from './utils/growthCalculator';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { LeadsPipelineView } from './components/LeadsPipelineView';
import { AuthorsAndBooksView } from './components/AuthorsAndBooksView';
import { OrdersAndSalesView } from './components/OrdersAndSalesView';
import { GrowthAnalyticsView } from './components/GrowthAnalyticsView';
import { FinancialLedgerView } from './components/FinancialLedgerView';
import { AdminDataManagementView } from './components/AdminDataManagementView';
import { AdminLoginModal } from './components/AdminLoginModal';
import {
  NewLeadModal,
  NewTransactionModal,
  NewBookModal,
  NewAuthorModal,
  NewSaleModal,
  NewPublishingOrderModal,
} from './components/Modals';
import {
  EditLeadModal,
  EditBookModal,
  EditAuthorModal,
  EditOrderModal,
  EditTransactionModal,
  EditSaleModal,
} from './components/EditModals';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Role Access: 'admin' (akses penuh tambah/edit/hapus) vs 'viewer' (mode baca saja)
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('bentala_user_role');
      return (saved as UserRole) || 'admin';
    } catch {
      return 'admin';
    }
  });

  // Admin Password
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('bentala_admin_password') || 'bentala2025';
    } catch {
      return 'bentala2025';
    }
  });

  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Genres management
  const [genres, setGenres] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bentala_genres');
      return saved ? JSON.parse(saved) : INITIAL_GENRES;
    } catch {
      return INITIAL_GENRES;
    }
  });

  // Save role to localStorage
  useEffect(() => {
    localStorage.setItem('bentala_user_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('bentala_admin_password', adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    try {
      localStorage.setItem('bentala_genres', JSON.stringify(genres));
    } catch (e) {
      console.error(e);
    }
  }, [genres]);

  const handleToggleUserRole = () => {
    if (userRole === 'admin') {
      setUserRole('viewer');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleAddGenre = (newGenre: string) => {
    const trimmed = newGenre.trim();
    if (!trimmed) return;
    setGenres((prev) => {
      if (prev.some((g) => g.toLowerCase() === trimmed.toLowerCase())) return prev;
      return [...prev, trimmed];
    });
  };

  const handleUpdateAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('bentala_admin_password', newPass);
  };

  // Persistence with localStorage
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('bentala_leads');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [authors, setAuthors] = useState<Author[]>(() => {
    try {
      const saved = localStorage.getItem('bentala_authors');
      return saved ? JSON.parse(saved) : INITIAL_AUTHORS;
    } catch {
      return INITIAL_AUTHORS;
    }
  });

  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('bentala_books');
      return saved ? JSON.parse(saved) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  const [orders, setOrders] = useState<PublishingOrder[]>(() => {
    try {
      const saved = localStorage.getItem('bentala_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [sales, setSales] = useState<BookSale[]>(() => {
    try {
      const saved = localStorage.getItem('bentala_sales');
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('bentala_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // DYNAMIC GROWTH CHARTS CALCULATION
  // Re-calculates and re-renders automatically whenever any transactions, leads, books, or sales change!
  const growthData = useMemo(() => {
    return computeDynamicMonthlyGrowth(leads, books, sales, transactions);
  }, [leads, books, sales, transactions]);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bentala_leads', JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('bentala_books', JSON.stringify(books));
    } catch (e) {
      console.error(e);
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem('bentala_authors', JSON.stringify(authors));
    } catch (e) {
      console.error(e);
    }
  }, [authors]);

  useEffect(() => {
    try {
      localStorage.setItem('bentala_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('bentala_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('bentala_sales', JSON.stringify(sales));
    } catch (e) {
      console.error(e);
    }
  }, [sales]);

  // Modal open states - Creation
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Modal open states - Editing
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [editingOrder, setEditingOrder] = useState<PublishingOrder | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const [editingSale, setEditingSale] = useState<BookSale | null>(null);

  // Business Action Handlers - Create
  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `ld-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleAddBook = (newBookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...newBookData,
      id: `bk-${Date.now().toString().slice(-4)}`,
    };
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleAddAuthor = (
    newAuthorData: Omit<
      Author,
      'id' | 'joinedDate' | 'publishedCount' | 'activeContracts' | 'totalRoyaltyEarned'
    >
  ) => {
    const newAuthor: Author = {
      ...newAuthorData,
      id: `aut-${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toISOString().slice(0, 10),
      publishedCount: 0,
      activeContracts: 1,
      totalRoyaltyEarned: 0,
    };
    setAuthors((prev) => [newAuthor, ...prev]);
  };

  const handleAddTransaction = (
    trxData: Omit<FinancialTransaction, 'id' | 'transactionNumber' | 'verified'>
  ) => {
    const prefix = trxData.type === 'pemasukan' ? 'IN' : 'OUT';
    const monthKey = new Date().toISOString().slice(0, 7).replace('-', '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newTrx: FinancialTransaction = {
      ...trxData,
      id: `trx-${Date.now()}`,
      transactionNumber: `TRX/${prefix}/${monthKey}/${randomSuffix}`,
      verified: true,
    };
    setTransactions((prev) => [newTrx, ...prev]);
  };

  const handleAddSale = (saleData: Omit<BookSale, 'id' | 'invoiceNumber'>) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const dateKey = new Date().toISOString().slice(2, 7).replace('-', '');
    const newSale: BookSale = {
      ...saleData,
      id: `sl-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `INV/SL/${dateKey}/${randomSuffix}`,
    };
    setSales((prev) => [newSale, ...prev]);

    // Automatically record revenue transaction
    handleAddTransaction({
      date: newSale.date,
      type: 'pemasukan',
      category: 'Penjualan Buku Fisik',
      description: `Penjualan ${newSale.quantity} Eks "${newSale.bookTitle}" via ${newSale.channel}`,
      amount: newSale.totalAmount,
      paymentMethod: 'BCA Bisnis',
      referenceId: newSale.invoiceNumber,
    });

    // Update inventory
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === newSale.bookId) {
          const newSold = b.soldCopies + newSale.quantity;
          const newStock = Math.max(0, b.stock - newSale.quantity);
          return { ...b, soldCopies: newSold, stock: newStock };
        }
        return b;
      })
    );
  };

  // EDIT HANDLERS (Updates data & dynamically updates charts)
  const handleSaveEditedLead = (updatedLead: Lead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
    );
  };

  const handleSaveEditedBook = (updatedBook: Book) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
    );
  };

  const handleSaveEditedAuthor = (updatedAuthor: Author) => {
    setAuthors((prev) =>
      prev.map((a) => (a.id === updatedAuthor.id ? updatedAuthor : a))
    );
  };

  const handleSaveEditedOrder = (updatedOrder: PublishingOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  const handleSaveEditedTransaction = (updatedTrx: FinancialTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTrx.id ? updatedTrx : t))
    );
  };

  const handleSaveEditedSale = (updatedSale: BookSale) => {
    const oldSale = sales.find((s) => s.id === updatedSale.id);
    setSales((prev) =>
      prev.map((s) => (s.id === updatedSale.id ? updatedSale : s))
    );

    // Reconcile book inventory if quantity changed or book changed
    if (oldSale) {
      const qtyDiff = updatedSale.quantity - oldSale.quantity;
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id === updatedSale.bookId) {
            return {
              ...b,
              soldCopies: Math.max(0, b.soldCopies + qtyDiff),
              stock: Math.max(0, b.stock - qtyDiff),
            };
          }
          return b;
        })
      );
    }

    // Update corresponding financial transaction
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.referenceId === updatedSale.invoiceNumber) {
          return {
            ...t,
            amount: updatedSale.totalAmount,
            date: updatedSale.date,
            description: `Penjualan ${updatedSale.quantity} Eks "${updatedSale.bookTitle}" via ${updatedSale.channel}`,
          };
        }
        return t;
      })
    );
  };

  const handleImportSales = (newSales: BookSale[]) => {
    if (!newSales || newSales.length === 0) return;

    // Prepend imported sales
    setSales((prev) => [...newSales, ...prev]);

    // Automatically record corresponding financial transactions
    const newTransactions: FinancialTransaction[] = newSales.map((sale) => {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const monthKey = new Date().toISOString().slice(0, 7).replace('-', '');
      return {
        id: `trx-import-${Date.now()}-${randomSuffix}`,
        transactionNumber: `TRX/IN/${monthKey}/${randomSuffix}`,
        date: sale.date,
        type: 'pemasukan' as const,
        category: 'Penjualan Buku Fisik',
        description: `[Impor CSV] Penjualan ${sale.quantity} Eks "${sale.bookTitle}" (${sale.customerName ? sale.customerName + ' - ' : ''}via ${sale.channel})`,
        amount: sale.totalAmount,
        paymentMethod: 'BCA Bisnis',
        referenceId: sale.invoiceNumber,
        verified: true,
      };
    });
    setTransactions((prev) => [...newTransactions, ...prev]);

    // Update stock and sold copies in book catalog
    setBooks((prev) =>
      prev.map((book) => {
        const bookSales = newSales.filter((s) => s.bookId === book.id);
        if (bookSales.length === 0) return book;
        const totalImportedQty = bookSales.reduce((acc, s) => acc + s.quantity, 0);
        return {
          ...book,
          soldCopies: book.soldCopies + totalImportedQty,
          stock: Math.max(0, book.stock - totalImportedQty),
        };
      })
    );
  };

  const handleBulkEditSales = (
    saleIds: string[],
    fields: {
      channel?: BookSale['channel'];
      date?: string;
      discountPercent?: number;
      customerName?: string;
    }
  ) => {
    setSales((prev) =>
      prev.map((sale) => {
        if (!saleIds.includes(sale.id)) return sale;
        const newChannel = fields.channel ?? sale.channel;
        const newDate = fields.date ?? sale.date;
        const newCustomerName =
          fields.customerName !== undefined ? fields.customerName : sale.customerName;
        const newDiscountPercent =
          fields.discountPercent !== undefined
            ? fields.discountPercent
            : sale.discountPercent || 0;
        const discountAmount = Math.round(
          (sale.unitPrice * newDiscountPercent) / 100
        );
        const priceAfterDiscount = sale.unitPrice - discountAmount;
        const totalAmount = priceAfterDiscount * sale.quantity;
        const hpp =
          sale.productionCostPerUnit || Math.round(sale.unitPrice * 0.35);
        const profit = totalAmount - hpp * sale.quantity;

        const updatedSale: BookSale = {
          ...sale,
          channel: newChannel,
          date: newDate,
          customerName: newCustomerName,
          discountPercent: newDiscountPercent,
          discountAmount,
          priceAfterDiscount,
          totalAmount,
          profit,
        };

        // Also update corresponding financial transaction
        setTransactions((txs) =>
          txs.map((tx) => {
            if (tx.referenceId === sale.invoiceNumber) {
              return {
                ...tx,
                date: newDate,
                amount: totalAmount,
                description: `Penjualan ${sale.quantity} Eks "${sale.bookTitle}" (${
                  newCustomerName ? newCustomerName + ' - ' : ''
                }via ${newChannel})`,
              };
            }
            return tx;
          })
        );

        return updatedSale;
      })
    );
  };

  const handleDeleteMultipleSales = (saleIds: string[]) => {
    const deletedSales = sales.filter((s) => saleIds.includes(s.id));
    const deletedInvoices = new Set(deletedSales.map((s) => s.invoiceNumber));

    // Revert inventory
    setBooks((prev) =>
      prev.map((b) => {
        const bookSales = deletedSales.filter((s) => s.bookId === b.id);
        if (bookSales.length === 0) return b;
        const returnedQty = bookSales.reduce((acc, s) => acc + s.quantity, 0);
        return {
          ...b,
          soldCopies: Math.max(0, b.soldCopies - returnedQty),
          stock: b.stock + returnedQty,
        };
      })
    );

    // Remove sales
    setSales((prev) => prev.filter((s) => !saleIds.includes(s.id)));

    // Remove financial transactions
    setTransactions((prev) =>
      prev.filter((t) => !deletedInvoices.has(t.referenceId || ''))
    );
  };

  const handleConfirmLeadToOrder = (
    leadId: string,
    orderData: {
      packageName: string;
      totalPrice: number;
      amountPaid: number;
      paymentStatus: 'lunas' | 'dp';
      copiesCount: number;
      targetPublishDate: string;
    }
  ) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    const currentYear = new Date().getFullYear();
    const orderSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `ORD/BENTALA/${currentYear}/${orderSuffix}`;
    const newOrderId = `ord-${Date.now().toString().slice(-4)}`;

    const newOrder: PublishingOrder = {
      id: newOrderId,
      orderNumber,
      authorName: targetLead.name,
      bookTitle: targetLead.manuscriptTitle,
      packageName: orderData.packageName,
      totalPrice: orderData.totalPrice,
      amountPaid: orderData.amountPaid,
      paymentStatus: orderData.paymentStatus,
      status: 'proses',
      orderDate: new Date().toISOString().slice(0, 10),
      targetCompletionDate: orderData.targetPublishDate,
      copiesCount: orderData.copiesCount,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update lead status to closing & link orderId
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              status: 'closing',
              orderId: newOrderId,
              estimatedPackage: orderData.packageName,
              estimatedValue: orderData.totalPrice,
            }
          : l
      )
    );

    // Record revenue transaction if amountPaid > 0
    if (orderData.amountPaid > 0) {
      handleAddTransaction({
        date: new Date().toISOString().slice(0, 10),
        type: 'pemasukan',
        category: 'Paket Penerbitan',
        description: `DP/Pelunasan ${orderData.packageName} naskah "${targetLead.manuscriptTitle}" (${targetLead.name})`,
        amount: orderData.amountPaid,
        paymentMethod: 'BCA Bisnis',
        referenceId: orderNumber,
      });
    }
  };

  const handleCreateNewOrderWithLead = (
    leadData: Omit<Lead, 'id' | 'createdAt'>,
    orderDetails: {
      amountPaid: number;
      paymentStatus: 'lunas' | 'dp';
      copiesCount: number;
      targetPublishDate: string;
    }
  ) => {
    const currentYear = new Date().getFullYear();
    const orderSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `ORD/BENTALA/${currentYear}/${orderSuffix}`;
    const newOrderId = `ord-${Date.now().toString().slice(-4)}`;
    const newLeadId = `ld-${Date.now().toString().slice(-4)}`;

    const newLead: Lead = {
      ...leadData,
      id: newLeadId,
      createdAt: new Date().toISOString().slice(0, 10),
      orderId: newOrderId,
      status: 'closing',
    };

    const newOrder: PublishingOrder = {
      id: newOrderId,
      orderNumber,
      authorName: leadData.name,
      bookTitle: leadData.manuscriptTitle,
      packageName: leadData.estimatedPackage,
      totalPrice: leadData.estimatedValue,
      amountPaid: orderDetails.amountPaid,
      paymentStatus: orderDetails.paymentStatus,
      status: 'proses',
      orderDate: new Date().toISOString().slice(0, 10),
      targetCompletionDate: orderDetails.targetPublishDate,
      copiesCount: orderDetails.copiesCount,
    };

    setLeads((prev) => [newLead, ...prev]);
    setOrders((prev) => [newOrder, ...prev]);

    if (orderDetails.amountPaid > 0) {
      handleAddTransaction({
        date: new Date().toISOString().slice(0, 10),
        type: 'pemasukan',
        category: 'Paket Penerbitan',
        description: `Penerimaan ${
          orderDetails.paymentStatus === 'lunas' ? 'Lunas' : 'DP'
        } ${leadData.estimatedPackage} "${leadData.manuscriptTitle}" (${
          leadData.name
        })`,
        amount: orderDetails.amountPaid,
        paymentMethod: 'BCA Bisnis',
        referenceId: orderNumber,
      });
    }
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;

        // When moved to closing, automatically confirm order and revenue if not yet confirmed
        if (newStatus === 'closing' && !lead.orderId) {
          const currentYear = new Date().getFullYear();
          const orderSuffix = Math.floor(100 + Math.random() * 900);
          const orderNumber = `ORD/BENTALA/${currentYear}/${orderSuffix}`;
          const newOrderId = `ord-${Date.now().toString().slice(-4)}`;

          const newOrder: PublishingOrder = {
            id: newOrderId,
            orderNumber,
            authorName: lead.name,
            bookTitle: lead.manuscriptTitle,
            packageName: lead.estimatedPackage || 'Paket Reguler Penerbitan',
            totalPrice: lead.estimatedValue || 6500000,
            amountPaid: lead.estimatedValue || 6500000,
            paymentStatus: 'lunas',
            status: 'proses',
            orderDate: new Date().toISOString().slice(0, 10),
            targetCompletionDate: new Date(Date.now() + 45 * 86400000)
              .toISOString()
              .slice(0, 10),
            copiesCount: 300,
          };

          setOrders((prevOrders) => [newOrder, ...prevOrders]);

          handleAddTransaction({
            date: new Date().toISOString().slice(0, 10),
            type: 'pemasukan',
            category: 'Paket Penerbitan',
            description: `Pelunasan Kontrak Paket Penerbitan "${lead.manuscriptTitle}" (${lead.name})`,
            amount: newOrder.amountPaid,
            paymentMethod: 'BCA Bisnis',
            referenceId: orderNumber,
          });

          return { ...lead, status: newStatus, orderId: newOrderId };
        }

        return { ...lead, status: newStatus };
      })
    );
  };

  const handleToggleLeadContacted = (leadId: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              contacted: !lead.contacted,
              lastContactedAt: new Date().toISOString().slice(0, 10),
            }
          : lead
      )
    );
  };

  const handleUpdateBookStatus = (bookId: string, newStatus: PublicationStatus) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === bookId ? { ...book, status: newStatus } : book))
    );
  };

  const handleToggleVerifyTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, verified: !t.verified } : t))
    );
  };

  // DELETE HANDLERS
  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  const handleDeleteMultipleLeads = (leadIds: string[]) => {
    setLeads((prev) => prev.filter((l) => !leadIds.includes(l.id)));
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const handleDeleteAuthor = (authorId: string) => {
    setAuthors((prev) => prev.filter((a) => a.id !== authorId));
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleDeleteSale = (saleId: string) => {
    setSales((prev) => prev.filter((s) => s.id !== saleId));
  };

  const handleDeleteTransaction = (trxId: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== trxId));
  };

  const handleDeleteMultipleTransactions = (trxIds: string[]) => {
    setTransactions((prev) => prev.filter((t) => !trxIds.includes(t.id)));
  };

  // CLEAR CATEGORIES
  const handleClearCategory = (
    category: 'leads' | 'books' | 'authors' | 'orders' | 'sales' | 'transactions' | 'all'
  ) => {
    switch (category) {
      case 'leads':
        setLeads([]);
        localStorage.removeItem('bentala_leads');
        break;
      case 'books':
        setBooks([]);
        localStorage.removeItem('bentala_books');
        break;
      case 'authors':
        setAuthors([]);
        localStorage.removeItem('bentala_authors');
        break;
      case 'orders':
        setOrders([]);
        localStorage.removeItem('bentala_orders');
        break;
      case 'sales':
        setSales([]);
        localStorage.removeItem('bentala_sales');
        break;
      case 'transactions':
        setTransactions([]);
        localStorage.removeItem('bentala_transactions');
        break;
      case 'all':
        setLeads([]);
        setBooks([]);
        setAuthors([]);
        setOrders([]);
        setSales([]);
        setTransactions([]);
        localStorage.removeItem('bentala_leads');
        localStorage.removeItem('bentala_books');
        localStorage.removeItem('bentala_authors');
        localStorage.removeItem('bentala_orders');
        localStorage.removeItem('bentala_sales');
        localStorage.removeItem('bentala_transactions');
        break;
    }
  };

  const handleRestoreDefaults = () => {
    setLeads(INITIAL_LEADS);
    setBooks(INITIAL_BOOKS);
    setAuthors(INITIAL_AUTHORS);
    setOrders(INITIAL_ORDERS);
    setSales(INITIAL_SALES);
    setTransactions(INITIAL_TRANSACTIONS);
    setGenres(INITIAL_GENRES);
    localStorage.setItem('bentala_leads', JSON.stringify(INITIAL_LEADS));
    localStorage.setItem('bentala_books', JSON.stringify(INITIAL_BOOKS));
    localStorage.setItem('bentala_authors', JSON.stringify(INITIAL_AUTHORS));
    localStorage.setItem('bentala_orders', JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem('bentala_sales', JSON.stringify(INITIAL_SALES));
    localStorage.setItem('bentala_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem('bentala_genres', JSON.stringify(INITIAL_GENRES));
  };

  const handleImportBackupData = (backup: any) => {
    if (backup.leads && Array.isArray(backup.leads)) setLeads(backup.leads);
    if (backup.books && Array.isArray(backup.books)) setBooks(backup.books);
    if (backup.authors && Array.isArray(backup.authors)) setAuthors(backup.authors);
    if (backup.orders && Array.isArray(backup.orders)) setOrders(backup.orders);
    if (backup.sales && Array.isArray(backup.sales)) setSales(backup.sales);
    if (backup.transactions && Array.isArray(backup.transactions)) setTransactions(backup.transactions);
    if (backup.genres && Array.isArray(backup.genres)) setGenres(backup.genres);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar Navigation with Role Switcher & Admin Login */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        onToggleUserRole={handleToggleUserRole}
        onOpenAdminLoginModal={() => setIsAdminLoginModalOpen(true)}
        onOpenNewLeadModal={() => setIsLeadModalOpen(true)}
        onOpenNewTransactionModal={() => setIsTransactionModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'overview' && (
          <OverviewDashboard
            leads={leads}
            authors={authors}
            books={books}
            orders={orders}
            transactions={transactions}
            growthData={growthData}
            onNavigateTab={setActiveTab}
            onOpenNewLeadModal={() => setIsLeadModalOpen(true)}
            onOpenNewTransactionModal={() => setIsTransactionModalOpen(true)}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsPipelineView
            leads={leads}
            userRole={userRole}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onToggleContacted={handleToggleLeadContacted}
            onOpenNewLeadModal={() => setIsLeadModalOpen(true)}
            onEditLead={(lead) => setEditingLead(lead)}
            onDeleteLead={handleDeleteLead}
            onDeleteMultipleLeads={handleDeleteMultipleLeads}
          />
        )}

        {activeTab === 'books' && (
          <AuthorsAndBooksView
            authors={authors}
            books={books}
            userRole={userRole}
            onUpdateBookStatus={handleUpdateBookStatus}
            onOpenNewBookModal={() => setIsBookModalOpen(true)}
            onOpenNewAuthorModal={() => setIsAuthorModalOpen(true)}
            onEditBook={(book) => setEditingBook(book)}
            onEditAuthor={(author) => setEditingAuthor(author)}
            onDeleteBook={handleDeleteBook}
            onDeleteAuthor={handleDeleteAuthor}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersAndSalesView
            orders={orders}
            sales={sales}
            books={books}
            userRole={userRole}
            onOpenNewOrderModal={() => setIsOrderModalOpen(true)}
            onOpenNewSaleModal={() => setIsSaleModalOpen(true)}
            onEditOrder={(order) => setEditingOrder(order)}
            onEditSale={(sale) => setEditingSale(sale)}
            onDeleteOrder={handleDeleteOrder}
            onDeleteSale={handleDeleteSale}
            onImportSales={handleImportSales}
            onBulkEditSales={handleBulkEditSales}
            onDeleteMultipleSales={handleDeleteMultipleSales}
          />
        )}

        {activeTab === 'growth' && (
          <GrowthAnalyticsView growthData={growthData} />
        )}

        {activeTab === 'finance' && (
          <FinancialLedgerView
            transactions={transactions}
            userRole={userRole}
            onOpenNewTransactionModal={() => setIsTransactionModalOpen(true)}
            onToggleVerifyTransaction={handleToggleVerifyTransaction}
            onEditTransaction={(trx) => setEditingTransaction(trx)}
            onDeleteTransaction={handleDeleteTransaction}
            onDeleteMultipleTransactions={handleDeleteMultipleTransactions}
          />
        )}

        {activeTab === 'admin' && userRole === 'admin' && (
          <AdminDataManagementView
            leads={leads}
            books={books}
            authors={authors}
            orders={orders}
            sales={sales}
            transactions={transactions}
            adminPassword={adminPassword}
            onUpdateAdminPassword={handleUpdateAdminPassword}
            onClearCategory={handleClearCategory}
            onRestoreDefaults={handleRestoreDefaults}
            onImportBackupData={handleImportBackupData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-auto py-5 text-xs text-neutral-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800">
              Penerbit Bentala Aksara Bestari
            </span>
            <span aria-hidden="true">·</span>
            <span>Sistem Informasi Penerbitan & Finansial Terpadu</span>
            <span aria-hidden="true">·</span>
            <span className={userRole === 'admin' ? 'text-emerald-700 font-semibold' : 'text-neutral-500 font-medium'}>
              Mode: {userRole === 'admin' ? 'Administrator' : 'Viewer (Hanya Lihat)'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {userRole === 'admin' ? (
              <button
                onClick={() => setActiveTab('admin')}
                className="text-rose-600 hover:text-rose-800 font-medium transition-colors"
              >
                Pusat Hapus Data (Admin)
              </button>
            ) : (
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="text-emerald-700 hover:text-emerald-900 font-semibold transition-colors flex items-center gap-1"
              >
                Masuk Mode Admin
              </button>
            )}
            <span className="text-neutral-400">© 2026 PT Bentala Aksara Bestari</span>
          </div>
        </div>
      </footer>

      {/* Interactive Creation Modals */}
      <NewLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSubmit={handleAddLead}
      />

      <NewPublishingOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        leads={leads}
        onConfirmLeadToOrder={handleConfirmLeadToOrder}
        onCreateNewOrderWithLead={handleCreateNewOrderWithLead}
      />

      <NewTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSubmit={handleAddTransaction}
      />

      <NewBookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        authors={authors}
        genres={genres}
        onAddGenre={handleAddGenre}
        onSubmit={handleAddBook}
      />

      <NewAuthorModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
        onSubmit={handleAddAuthor}
      />

      <NewSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        books={books}
        authors={authors}
        onSubmit={handleAddSale}
      />

      {/* Interactive Editing Modals */}
      <EditLeadModal
        isOpen={!!editingLead}
        lead={editingLead}
        onClose={() => setEditingLead(null)}
        onSubmit={handleSaveEditedLead}
      />

      <EditBookModal
        isOpen={!!editingBook}
        book={editingBook}
        authors={authors}
        genres={genres}
        onAddGenre={handleAddGenre}
        onClose={() => setEditingBook(null)}
        onSubmit={handleSaveEditedBook}
      />

      <EditAuthorModal
        isOpen={!!editingAuthor}
        author={editingAuthor}
        onClose={() => setEditingAuthor(null)}
        onSubmit={handleSaveEditedAuthor}
      />

      <EditOrderModal
        isOpen={!!editingOrder}
        order={editingOrder}
        onClose={() => setEditingOrder(null)}
        onSubmit={handleSaveEditedOrder}
      />

      <EditTransactionModal
        isOpen={!!editingTransaction}
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSubmit={handleSaveEditedTransaction}
      />

      <EditSaleModal
        isOpen={!!editingSale}
        sale={editingSale}
        books={books}
        onClose={() => setEditingSale(null)}
        onSubmit={handleSaveEditedSale}
      />

      {/* Admin Login Modal with Password */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={() => {
          setUserRole('admin');
          setIsAdminLoginModalOpen(false);
        }}
        currentAdminPassword={adminPassword}
      />
    </div>
  );
}
