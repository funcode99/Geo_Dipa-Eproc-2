// Menu Client / Internal
export const DataAsideMenuListClient = [
  

  // addendum contract
  {
    rootPath: "/client/addendum-contract",
    // yang salah adalah file SVG nya
    icon: "/All/New_Addendum_Contract.svg",
    // icon: "/All/New_Delivery_Monitoring.svg",
    // icon: "/Communication/user-solid.svg",
    title: "MENU.ADDENDUM_CONTRACT",
    subMenu: [
      {
        rootPath: "/client/addendum-contract/list-contract-po",
        title: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
        subMenu: null
      },
      {
        rootPath: '/client/addendum-contract/list-addendum-request',
        title: "MENU.ADDENDUM_CONTRACT.LIST_ADDENDUM_REQUEST",
        subMenu: null
      },
      {
        rootPath: '/client/addendum-contract/list-of-addendum',
        title: "MENU.ADDENDUM_CONTRACT.LIST_ADDENDUM",
        subMenu: null
      }
    ]
  },

  // delivery monitoring
  {
    rootPath: "/client/delivery-monitoring",
    icon: "/All/New_Delivery_Monitoring.svg",
    title: "MENU.DELIVERY_MONITORING",
    subMenu: [
      {
        rootPath: "/client/delivery-monitoring/dashboard",
        title: "MENU.DASHBOARD",
        subMenu: null,
      },
      {
        rootPath: "/client/delivery-monitoring/contract",
        title: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
        subMenu: null,
      },
      {
        rootPath: "/client/delivery-monitoring/gr",
        title: "MENU.DELIVERY_MONITORING.GOOD_RECEIPT",
        subMenu: null,
      },
      {
        rootPath: "/client/delivery-monitoring/sa",
        title: "MENU.DELIVERY_MONITORING.SERVICE_ACCEPTANCE",
        subMenu: null,
      },
      // {
      //   rootPath: "/client/delivery-monitoring-2/error-v",
      //   title: "MENU.DELIVERY_MONITORING.SERVICE_ACCEPTANCE",
      //   subMenu: [
      //     {
      //       rootPath: "/client/delivery-monitoring-2/error-v/1",
      //       title: "TITLE.TEST",
      //     },
      //   ],
      // },
    ],
  },

  // contract management
  {
    rootPath: "/client/management",
    icon: "/All/New_Contract_Management.svg",
    title: "MENU.ADDENDUM_CONTRACT.CONTRACT_MANAGEMENT",
  },

  // monitoring contract & addendum
  {
    rootPath: "/client/monitoring-contract-addendum",
    icon: "/All/New_Monitoring_Contract_Addendum.svg",
    title: "MENU.MONITORING_CONTRACT_ADDENDUM",
  },
  
  // client invoice monitoring
  {
    rootPath: "/client/invoice_monitoring",
    // icon: "/All/file-invoice-dollar-solid.svg",
    icon: "/All/New_Invoice_Monitoring.svg",
    title: "MENU.INVOICE_MONITORING",
    subMenu: [
      {
        rootPath: "/client/invoice_monitoring/dashboard",
        title: "MENU.DASHBOARD",
        subMenu: null,
      },
      {
        rootPath: "/client/invoice_monitoring/contract",
        title: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
        subMenu: null,
      },
      {
        rootPath: "/client/invoice_monitoring/invoice_document",
        title: "MENU.INVOICE_MONITORING.INVOICE_DOCUMENT",
        subMenu: null,
      },
      {
        rootPath: "/client/invoice_monitoring/bkb",
        title: "MENU.INVOICE_MONITORING.BKB_FV",
        subMenu: null,
      },
      {
        rootPath: "/client/invoice_monitoring/spt",
        title: "MENU.INVOICE_MONITORING.SPT",
        subMenu: null,
      },
      // {
      //   rootPath: "/client/invoice_monitoring-4/error-v",
      //   title: "MENU.INVOICE_MONITORING.TAX",
      //   subMenu: [
      //     {
      //       rootPath: "/client/invoice_monitoring-4/error-v/1",
      //       title: "TITLE.TEST",
      //     },
      //     {
      //       rootPath: "/client/invoice_monitoring-4/error-v/2",
      //       title: "TITLE.TEST",
      //     },
      //   ],
      // },
      {
        rootPath: "/client/invoice_monitoring/mismatch",
        title: "MENU.INVOICE_MONITORING.CONTRACT_TROUBLES",
        subMenu: null,
      },
    ],
  },
  
  {
    rootPath: "/client/user-profile",
    icon: "/Communication/user-solid.svg",
    title: "MENU.USER_PROFILE",
    subMenu: null,
  },

  {
    rootPath: "/client/reports",
    icon: "/Communication/Archive.svg",
    title: "MENU.REPORTS",
    subMenu: null,
  },

  {
    rootPath: "/client/user-management",
    icon: "/All/users-solid.svg",
    title: "MENU.USER_MANAGEMENT",
    subMenu: null,
  },

  {
    rootPath: "/client/master",
    icon: "/All/table-solid.svg",
    title: "MENU.MASTER_DATA",
    subMenu: [
      {
        rootPath: "/client/master/document_types",
        title: "MENU.MASTER_DATA.DOCUMENT_TYPES",
        subMenu: null,
      },
      {
        rootPath: "/client/master/periode",
        title: "MENU.MASTER_DATA.PERIOD",
        subMenu: null,
      },
      {
        rootPath: "/client/master/roles",
        title: "MENU.MASTER_DATA.ROLES",
        subMenu: null,
      },
      {
        rootPath: "/client/master/invoice_authority",
        title: "MENU.MASTER_DATA.INVOICE_AUTHORITY",
        subMenu: null,
      },
      {
        rootPath: "/client/master/invoice_periode",
        title: "MENU.MASTER_DATA.INVOICE_PERIODS",
        subMenu: null,
      },
      {
        rootPath: "/client/master/service_level_agreement",
        title: "TITLE.SERVICE_LEVEL_AGREEMENT",
        subMenu: null,
      },
      {
        rootPath: "/client/master/async",
        title: "TITLE.SYNCHRONIZE_DATA",
        subMenu: null,
      },
      {
        rootPath: "/client/master/email",
        title: "TITLE.EMAIL",
        subMenu: null,
      },
      {
        rootPath: "/client/master/purch_group",
        title: "TITLE.PURCHASE_GROUPS",
        subMenu: null,
      },
      {
        rootPath: "/client/master/tax",
        title: "TITLE.TAX",
        subMenu: null,
      },
    ],
  },

]

// Menu Vendor / External
export const DataAsideMenuListVendor = [
  
  {
    rootPath: "/vendor/addendum-contract",
    // icon: "/All/New_Addendum_Contract.svg",
    icon: "/All/New_Delivery_Monitoring.svg",
    title: "MENU.ADDENDUM_CONTRACT",
    subMenu: [
      {
        rootPath: "/vendor/addendum-contract/list-addendum-request",
        title: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
        subMenu: null
      }
    ]
  },

  {
    rootPath: "/vendor/delivery-monitoring",
    icon: "/All/New_Delivery_Monitoring.svg",
    title: "MENU.DELIVERY_MONITORING",
    subMenu: [
      // {
      //   rootPath: "/vendor/delivery-monitoring/dashboard",
      //   title: "MENU.DASHBOARD",
      //   subMenu: null,
      // },
      {
        rootPath: "/vendor/delivery-monitoring/contract",
        title: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
        subMenu: null,
      },
      {
        rootPath: "/vendor/delivery-monitoring/gr",
        title: "MENU.DELIVERY_MONITORING.GOOD_RECEIPT",
        subMenu: null,
      },
      {
        rootPath: "/vendor/delivery-monitoring/sa",
        title: "MENU.DELIVERY_MONITORING.SERVICE_ACCEPTANCE",
        subMenu: null,
      },
      // {
      //   rootPath: "/vendor/delivery-monitoring/contract",
      //   title: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
      //   subMenu: null,
      // },
      // {
      //   rootPath: "/vendor/delivery-monitoring-1/error-v",
      //   title: "MENU.DELIVERY_MONITORING.GOOD_RECEIPT",
      //   subMenu: [
      //     {
      //       rootPath: "/vendor/delivery-monitoring/gr",
      //       title: "TITLE.LIST_GR",
      //     },
      //   ],
      // },
      // {
      //   rootPath: "/vendor/delivery-monitoring-2/error-v",
      //   title: "MENU.DELIVERY_MONITORING.SERVICE_ACCEPTANCE",
      //   subMenu: [
      //     {
      //       rootPath: "/vendor/delivery-monitoring-2/error-v/1",
      //       title: "TITLE.TEST",
      //     },
      //   ],
      // },
    ],
  },

  {
    rootPath: "/vendor/invoice_monitoring",
    icon: "/All/file-invoice-dollar-solid.svg",
    title: "MENU.INVOICE_MONITORING",
    subMenu: [
      {
        rootPath: "/vendor/invoice_monitoring/contract",
        title: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
        subMenu: null,
      },
      {
        rootPath: "/vendor/invoice_monitoring/invoice_document",
        title: "MENU.INVOICE_MONITORING.INVOICE_DOCUMENT",
        subMenu: null,
      },
    ],
  },

  {
    rootPath: "/vendor/user-profile",
    icon: "/All/users-solid.svg",
    title: "MENU.USER_MANAGEMENT",
    subMenu: null,
  },

]