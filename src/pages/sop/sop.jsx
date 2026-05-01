import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiCall } from "../../utils/services";
import Layout from "../../components/Layout";
import { toast } from "react-hot-toast";
const Sop = () => {
  const [sops, setSops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchSops = () => {
    setLoading(true);
    getApiCall(
      "servicesop",
      (res) => {
        setSops(res || []);
        setLoading(false);
      },
      () => {
        toast.error("Failed to load SOP services");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchSops();
  }, []);

  const filteredSops = sops.filter((item) => {
    const text = search.trim().toLowerCase();
    if (!text) return true;
    return (
      (item.name || item.serviceName || item.sopName || "")
        .toLowerCase()
        .includes(text) ||
      (item.category || item.type || "")
        .toLowerCase()
        .includes(text)
    );
  });

  const getLabel = (item) => item.name || item.serviceName || item.sopName || "-";
  const getCategory = (item) => item.category || item.type || item.group || "-";
  const getDuration = (item) => item.totalDuration || item.duration || item.time || "-";
  const getStatus = (item) => {
    if (item.isActive !== undefined) return item.isActive ? "Active" : "Inactive";
    if (item.status !== undefined) return item.status === 1 ? "Active" : "Inactive";
    return "-";
  };

  return (
      <div className="rounded-[16px] border border-primaryGray bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <h2 className="text-black text-[22px] font-semibold">SOP Services</h2>
            <p className="text-sm text-slate-500 mt-1">
              Browse the SOP service list. This view only shows available services.
            </p>
          </div>

          <div className="w-full md:w-80">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services"
              className="w-full rounded-[12px] border border-[#D9D9D9] bg-white px-4 py-3 text-sm outline-none transition-shadow focus:border-slate-400 focus:shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-slate-50 text-sm text-slate-700">
                <th className="p-4 font-medium">Service Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Duration</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-600">
                    Loading SOP services...
                  </td>
                </tr>
              ) : filteredSops.length > 0 ? (
                filteredSops.map((sop) => (
                  <tr
                    key={sop._id || sop.id || getLabel(sop)}
                    className="border-b hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/sop/${sop._id || sop.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        navigate(`/sop/${sop._id || sop.id}`);
                      }
                    }}
                  >
                    <td className="p-4 text-slate-900">{getLabel(sop)}</td>
                    <td className="p-4 text-slate-600">{getCategory(sop)}</td>
                    <td className="p-4 text-slate-600">{getDuration(sop)}</td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        getStatus(sop) === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {getStatus(sop)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No SOP services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default Sop;