import { persistReducer } from "redux-persist";
import { PERSIST_REDUCER } from "redux/BaseHost";
import { actionTypes } from "./addendumContractAction";

const bodyClauseDataTemplate = {
  clause_number: "",
  before_clause_note: "",
  after_clause_note: "",
};

const attachmentClauseDataTemplate = {
  attachment_number: "",
  clause_note: "",
};

const initialDelivMonitoringState = {
  dataDeverableDoc: null,
  dataContractById: [],
  dataNewClause: {
    parties: {
      bodyClauseData: bodyClauseDataTemplate,
      attachmentClauseData: [attachmentClauseDataTemplate],
    },
    job_price: {
      bodyClauseData: bodyClauseDataTemplate,
      attachmentClauseData: [attachmentClauseDataTemplate],
    },
    time_period: {
      bodyClauseData: bodyClauseDataTemplate,
      attachmentClauseData: [attachmentClauseDataTemplate],
    },
    payment_method: {
      bodyClauseData: bodyClauseDataTemplate,
      attachmentClauseData: [attachmentClauseDataTemplate],
    },
    fine: {
      bodyClauseData: bodyClauseDataTemplate,
      attachmentClauseData: [attachmentClauseDataTemplate],
    },
    guarantee: {
      bodyClauseData: bodyClauseDataTemplate,
      attachmentClauseData: [attachmentClauseDataTemplate],
    },
    account_number: {
      bodyClauseData: bodyClauseDataTemplate,
      attachmentClauseData: [attachmentClauseDataTemplate],
    },
    other: {
      bodyClauseData: [bodyClauseDataTemplate],
      attachmentClauseData: [attachmentClauseDataTemplate],
    },
  },
  dataJasa: [],
  dataBarang: [],
  dataDocuments: [],
  dataSubmitItems: {
    task_items: [],
    task_services: [],
  },
  dataTask: {},
  dataOrderItems: [],
  dataTempOrderItems: [],
  dataUpdateOrderItems: [],
  notifDeliveryMonitoring: [],
  notifMeta: {
    page: 1,
    per_page: 10,
    data_unread: 0,
    data_available: 0,
    total_page: 1,
  },
};

export const reducer = persistReducer(
  PERSIST_REDUCER,
  (state = initialDelivMonitoringState, action) => {
    switch (action.type) {
      case actionTypes.SetDataDeverableDoc: {
        const { dataDeverableDoc } = action.payload;
        return { ...state, dataDeverableDoc };
      }

      case actionTypes.SetDataJasa: {
        return {
          ...state,
          dataJasa: action.payload,
        };
      }

      case actionTypes.SetDataBarang: {
        return {
          ...state,
          dataBarang: action.payload,
        };
      }

      case actionTypes.SetDataDocuments: {
        return {
          ...state,
          dataDocuments: action.payload,
        };
      }

      case actionTypes.SetContractById: {
        return {
          ...state,
          dataContractById: action.payload,
        };
      }

      case actionTypes.SetDataClause: {
        if (action.fromWhere === "parties") {
          // menambah lampiran baru
          if (action.fieldType === "clause_attachment") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                parties: {
                  ...state.dataNewClause.parties,
                  attachmentClauseData: [
                    ...state.dataNewClause.parties.attachmentClauseData,
                    action.payload,
                  ],
                },
              },
            };
          }
          if (action.fieldType === "attachment_number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                parties: {
                  ...state.dataNewClause.parties,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause_note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                parties: {
                  ...state.dataNewClause.parties,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                parties: {
                  ...state.dataNewClause.parties,
                  bodyClauseData: {
                    ...state.dataNewClause.parties.bodyClauseData,
                    clause_number: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "before clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                parties: {
                  ...state.dataNewClause.parties,
                  bodyClauseData: {
                    ...state.dataNewClause.parties.bodyClauseData,
                    before_clause_note: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "after clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                parties: {
                  ...state.dataNewClause.parties,
                  bodyClauseData: {
                    ...state.dataNewClause.parties.bodyClauseData,
                    after_clause_note: action.payload,
                  },
                },
              },
            };
          }
        }
        if (action.fromWhere === "job_price") {
          if (action.fieldType === "clause_attachment") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                job_price: {
                  ...state.dataNewClause.job_price,
                  attachmentClauseData: [
                    ...state.dataNewClause.job_price.attachmentClauseData,
                    action.payload,
                  ],
                },
              },
            };
          }
          if (action.fieldType === "attachment_number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                job_price: {
                  ...state.dataNewClause.job_price,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause_note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                job_price: {
                  ...state.dataNewClause.job_price,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                job_price: {
                  ...state.dataNewClause.job_price,
                  bodyClauseData: {
                    ...state.dataNewClause.job_price.bodyClauseData,
                    clause_number: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "before clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                job_price: {
                  ...state.dataNewClause.job_price,
                  bodyClauseData: {
                    ...state.dataNewClause.job_price.bodyClauseData,
                    before_clause_note: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "after clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                job_price: {
                  ...state.dataNewClause.job_price,
                  bodyClauseData: {
                    ...state.dataNewClause.job_price.bodyClauseData,
                    after_clause_note: action.payload,
                  },
                },
              },
            };
          }
        }
        if (action.fromWhere === "time_period") {
          if (action.fieldType === "clause_attachment") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                time_period: {
                  ...state.dataNewClause.time_period,
                  attachmentClauseData: [
                    ...state.dataNewClause.time_period.attachmentClauseData,
                    action.payload,
                  ],
                },
              },
            };
          }
          if (action.fieldType === "attachment_number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                time_period: {
                  ...state.dataNewClause.time_period,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause_note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                time_period: {
                  ...state.dataNewClause.time_period,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }

          if (action.fieldType === "clause number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                time_period: {
                  ...state.dataNewClause.time_period,
                  bodyClauseData: {
                    ...state.dataNewClause.time_period.bodyClauseData,
                    clause_number: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "before clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                time_period: {
                  ...state.dataNewClause.time_period,
                  bodyClauseData: {
                    ...state.dataNewClause.time_period.bodyClauseData,
                    before_clause_note: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "after clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                time_period: {
                  ...state.dataNewClause.time_period,
                  bodyClauseData: {
                    ...state.dataNewClause.time_period.bodyClauseData,
                    after_clause_note: action.payload,
                  },
                },
              },
            };
          }
        }
        if (action.fromWhere === "payment_method") {
          if (action.fieldType === "clause_attachment") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                payment_method: {
                  ...state.dataNewClause.payment_method,
                  attachmentClauseData: [
                    ...state.dataNewClause.payment_method.attachmentClauseData,
                    action.payload,
                  ],
                },
              },
            };
          }
          if (action.fieldType === "attachment_number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                payment_method: {
                  ...state.dataNewClause.payment_method,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause_note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                payment_method: {
                  ...state.dataNewClause.payment_method,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                payment_method: {
                  ...state.dataNewClause.payment_method,
                  bodyClauseData: {
                    ...state.dataNewClause.payment_method.bodyClauseData,
                    clause_number: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "before clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                payment_method: {
                  ...state.dataNewClause.payment_method,
                  bodyClauseData: {
                    ...state.dataNewClause.payment_method.bodyClauseData,
                    before_clause_note: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "after clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                payment_method: {
                  ...state.dataNewClause.payment_method,
                  bodyClauseData: {
                    ...state.dataNewClause.payment_method.bodyClauseData,
                    after_clause_note: action.payload,
                  },
                },
              },
            };
          }
        }
        if (action.fromWhere === "fine") {
          if (action.fieldType === "clause_attachment") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                fine: {
                  ...state.dataNewClause.fine,
                  attachmentClauseData: [
                    ...state.dataNewClause.fine.attachmentClauseData,
                    action.payload,
                  ],
                },
              },
            };
          }
          if (action.fieldType === "attachment_number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                fine: {
                  ...state.dataNewClause.fine,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause_note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                fine: {
                  ...state.dataNewClause.fine,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                fine: {
                  ...state.dataNewClause.fine,
                  bodyClauseData: {
                    ...state.dataNewClause.fine.bodyClauseData,
                    clause_number: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "before clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                fine: {
                  ...state.dataNewClause.fine,
                  bodyClauseData: {
                    ...state.dataNewClause.fine.bodyClauseData,
                    before_clause_note: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "after clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                fine: {
                  ...state.dataNewClause.fine,
                  bodyClauseData: {
                    ...state.dataNewClause.fine.bodyClauseData,
                    after_clause_note: action.payload,
                  },
                },
              },
            };
          }
        }
        if (action.fromWhere === "guarantee") {
          if (action.fieldType === "clause_attachment") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                guarantee: {
                  ...state.dataNewClause.guarantee,
                  attachmentClauseData: [
                    ...state.dataNewClause.guarantee.attachmentClauseData,
                    action.payload,
                  ],
                },
              },
            };
          }
          if (action.fieldType === "attachment_number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                guarantee: {
                  ...state.dataNewClause.guarantee,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause_note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                guarantee: {
                  ...state.dataNewClause.guarantee,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                guarantee: {
                  ...state.dataNewClause.guarantee,
                  bodyClauseData: {
                    ...state.dataNewClause.guarantee.bodyClauseData,
                    clause_number: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "before clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                guarantee: {
                  ...state.dataNewClause.guarantee,
                  bodyClauseData: {
                    ...state.dataNewClause.guarantee.bodyClauseData,
                    before_clause_note: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "after clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                guarantee: {
                  ...state.dataNewClause.guarantee,
                  bodyClauseData: {
                    ...state.dataNewClause.guarantee.bodyClauseData,
                    after_clause_note: action.payload,
                  },
                },
              },
            };
          }
        }
        if (action.fromWhere === "account_number") {
          if (action.fieldType === "clause_attachment") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                account_number: {
                  ...state.dataNewClause.account_number,
                  attachmentClauseData: [
                    ...state.dataNewClause.account_number.attachmentClauseData,
                    action.payload,
                  ],
                },
              },
            };
          }
          if (action.fieldType === "attachment_number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                account_number: {
                  ...state.dataNewClause.account_number,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause_note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                account_number: {
                  ...state.dataNewClause.account_number,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                account_number: {
                  ...state.dataNewClause.account_number,
                  bodyClauseData: {
                    ...state.dataNewClause.account_number.bodyClauseData,
                    clause_number: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "before clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                account_number: {
                  ...state.dataNewClause.account_number,
                  bodyClauseData: {
                    ...state.dataNewClause.account_number.bodyClauseData,
                    before_clause_note: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "after clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                account_number: {
                  ...state.dataNewClause.account_number,
                  bodyClauseData: {
                    ...state.dataNewClause.account_number.bodyClauseData,
                    after_clause_note: action.payload,
                  },
                },
              },
            };
          }
        }
        if (action.fromWhere === "other") {
          if (action.fieldType === "contract_body") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                other: {
                  ...state.dataNewClause.other,
                  bodyClauseData: [
                    ...state.dataNewClause.other.bodyClauseData,
                    action.payload,
                  ],
                },
              },
            };
          }
          if (action.fieldType === "clause_attachment") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                other: {
                  ...state.dataNewClause.other,
                  attachmentClauseData: [
                    ...state.dataNewClause.other.attachmentClauseData,
                    action.payload,
                  ],
                },
              },
            };
          }
          if (action.fieldType === "attachment_number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                other: {
                  ...state.dataNewClause.other,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause_note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                other: {
                  ...state.dataNewClause.other,
                  attachmentClauseData: action.payload,
                },
              },
            };
          }
          if (action.fieldType === "clause number") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                other: {
                  ...state.dataNewClause.other,
                  bodyClauseData: {
                    ...state.dataNewClause.other.bodyClauseData,
                    clause_number: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "before clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                other: {
                  ...state.dataNewClause.other,
                  bodyClauseData: {
                    ...state.dataNewClause.other.bodyClauseData,
                    before_clause_note: action.payload,
                  },
                },
              },
            };
          } else if (action.fieldType === "after clause note") {
            return {
              ...state,
              dataNewClause: {
                ...state.dataNewClause,
                other: {
                  ...state.dataNewClause.other,
                  bodyClauseData: {
                    ...state.dataNewClause.other.bodyClauseData,
                    after_clause_note: action.payload,
                  },
                },
              },
            };
          }
        }
      }

      // kalo case di atas gagal return bakal turun kebawah case & return nya
      case actionTypes.SetSubmitItemsByContractId: {
        return {
          ...state,
          dataSubmitItems: action.payload,
        };
      }

      case actionTypes.SetDataTask: {
        return {
          ...state,
          dataTask: action.payload,
        };
      }

      case actionTypes.SetDataOrderItems: {
        return {
          ...state,
          dataOrderItems: action.payload,
        };
      }

      case actionTypes.SetDataTempOrderItems: {
        return {
          ...state,
          dataTempOrderItems: action.payload,
        };
      }

      case actionTypes.SetDataUpdateOrderItems: {
        return {
          ...state,
          dataUpdateOrderItems: action.payload,
        };
      }

      case actionTypes.saveNotifDM: {
        const { list, meta } = action.payload;
        return {
          ...state,
          notifDeliveryMonitoring: list,
          notifMeta: meta,
        };
      }

      default:
        return state;
    }
  }
);

// actions below
export const setDataDeverableDoc = (dataDeverableDoc) => ({
  type: actionTypes.SetDataDeverableDoc,
  payload: { dataDeverableDoc },
});

export const set_contract_id = (payload) => ({
  type: actionTypes.SetContractById,
  payload,
});

export const store_notif_dm_rd = (payload) => ({
  type: actionTypes.saveNotifDM,
  payload,
});
