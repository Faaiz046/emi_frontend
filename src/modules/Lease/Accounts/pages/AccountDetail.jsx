import React,{useState,useEffect} from 'react'
import {
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaUserTie,
    FaUniversity,
    FaMoneyCheckAlt,
    FaBox,
    FaDollarSign,
    FaCalendarAlt,
    FaTag,
    FaIndustry,
    FaLayerGroup,
    FaInfoCircle,
  } from "react-icons/fa";
  import { Card } from "../../../../shared/components/ui/Card";
import { DataTable } from "../../../../shared/components/ui/DataTable";
import { getFormattedDate, formatCurrency } from "../../../../utils/common";
import { leaseAccountApi } from "../../services";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AccountDetai = () => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const { account_id } = useParams();
    
    const loadAccount = async () => {
        try {
          setLoading(true);
          const res = await leaseAccountApi.getLeaseAccountById({ id: account_id });
          const accountData = res?.data || res;
          setAccount(accountData);
        } catch (error) {
          console.error('Error loading account:', error);
          toast.error(error?.message || "Failed to load account details");
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(() => {
        if (account_id) {
          loadAccount();
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [account_id]);

  const columns4 = [
    { key: "sr", label: "Sr" },
    { key: "install_date", label: "Install Date", render: (v) => getFormattedDate(v) },
    { key: "recv_no", label: "Recv No", render: (v) => v },
    { key: "pre_balance", label: "Pre Balance", render: (v) => formatCurrency(v) },
    { key: "install_charge", label: "Install Charge", render: (v) => formatCurrency(v) },
    { key: "balance", label: "Balance", render: (v) => formatCurrency(v) },
    { key: "recovery", label: "Recovery", render: (v) => formatCurrency(v) },
    { key: "fine", label: "Fine", render: (v) => formatCurrency(v) },
    { key: "fine_type", label: "Fine Type" },
  ];

    const InfoCard = ({ title, icon: Icon, data }) => (
        <Card className="p-5 shadow-sm border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
            <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm w-full">
            {data.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-xs text-gray-500">{item.label}</span>
                <span className="font-medium text-gray-900">
                  {item.value || "N/A"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      );

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show error state if no account data
  if (!account) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Not Found</h2>
          <p className="text-gray-600">Unable to load account details. Please check the account ID and try again.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
           <div className="container mx-auto px-4 py-6">
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Account #{account?.acc_no}
              </h2>
              <p className="text-gray-600">{account?.customer_name}</p>
            </div>
            {/* <div>
              <p className="text-sm text-gray-500">Product</p>
              <p className="font-medium">{account?.product?.name}</p>
            </div> */}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">

          <InfoCard
            title="Contact Info"
            icon={FaPhoneAlt}
            data={[
              { label: "Cell No.", value: account?.cell_no },
              {
                label: "Tel. Res.",
                value: account?.customer?.residential_phone,
              },
              {
                label: "Tel. Office",
                value: account?.customer?.office_phone,
              },
            ]}
          />

          <InfoCard
            title="Address Info"
            icon={FaMapMarkerAlt}
            data={[
              {
                label: "Res. Address",
                value: account?.customer?.residential_address,
              },
              {
                label: "Off. Address",
                value: account?.customer?.office_address,
              },
            ]}
          />

          <InfoCard
            title="Banking Info"
            icon={FaUniversity}
            data={[
              {
                label: "Bank Name",
                value: account?.customer?.bank_name,
              },
              {
                label: "Cheque No.",
                value: account?.customer?.cheque_number,
              },
              {
                label: "Cheque Amount",
                value: account?.customer?.cheque_amount
                  ? formatCurrency(account?.customer?.cheque_amount)
                  : null,
              },
            ]}
          />

          <InfoCard
            title="Officer Info"
            icon={FaUserTie}
            data={[
              {
                label: "Inquiry Officer",
                value: account?.officer?.name,
              },
              {
                label: "Marketing By",
                value: account?.customer?.marketing_officer_id,
              },
              {
                label: "Stamp Paper",
                value: account?.customer?.stamp_paper ? "Yes" : "No",
              },
            ]}
          />
        </div>
        
        {/* {account?.process?.product && (
          <Card className="p-6 shadow-lg rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
              <div className="relative">
                <img
                  src={account?.process?.product?.brand?.logo}
                  alt={account?.process?.product?.brand?.name}
                  className="w-16 h-16 rounded-xl object-contain border-2 border-gray-200 shadow-sm"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {account?.process?.product?.name}
                </h2>
                <p className="text-sm text-gray-600 font-medium">
                  {account?.process?.product?.model}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Brand:</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {account?.process?.product?.brand?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Category:</span>
                    <span className="text-sm font-semibold text-indigo-600">
                      {account?.process?.product?.category?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <FaDollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Cash Price
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(account?.process?.product?.cash_price)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <FaDollarSign className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Installment Price
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(account?.process?.product?.installment_price)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <FaDollarSign className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Monthly Installment
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(account?.process?.product?.monthly_installment)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Duration
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {account?.process?.product?.duration} Months
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <FaTag className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Advance
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(account?.process?.product?.advance)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <FaTag className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Fine
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(account?.process?.product?.fine)}
                </p>
              </div>
            </div>

            {account?.process?.product?.notes && (
              <div className="mt-6 bg-amber-50 border border-amber-200 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <FaInfoCircle className="w-3 h-3 text-amber-600" />
                  </div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                    Notes
                  </p>
                </div>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {account?.process?.product?.notes}
                </p>
              </div>
            )}
          </Card>
        )} */}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mb-6'>
        <InfoCard
            title="Product Info"
            icon={FaBox}
            data={[
              {
                label: "Product Name",
                value: account?.process?.product?.name,
              },
              {
                label: "Product Model",
                value: account?.process?.product?.model,
              },
              {
                label: "Product Brand",
                value: account?.process?.product?.brand?.name,
              },
              {
                label: "Product Category",
                value: account?.process?.product?.category?.name,
              },
             
            ]}
          />
        </div>

        {account?.installments && account.installments.length > 0 && (
          <div className="bg-gray-50 p-2 rounded border border-gray-200 mt-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Installments
            </h3>
            <DataTable
              data={account?.installments.map((item, index) => ({ ...item, sr: index + 1 }))}
              columns={columns4}
              loading={loading}
              pagination={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountDetai