import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiCall } from "../../utils/services";
import Layout from "../../components/Layout";
import { toast } from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";

const SopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sop, setSop] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSop = () => {
    setLoading(true);
    getApiCall(
      `servicesop/${id}`,
      (res) => {
        const response = Array.isArray(res) ? res[0] : res;
        setSop(response || null);
        setLoading(false);
      },
      () => {
        toast.error("Failed to load SOP details");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (id) {
      fetchSop();
    }
  }, [id]);

  const renderList = (list) => {
    if (!list || !list.length) return <p className="text-sm text-slate-500">No items available.</p>;
    return (
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
        {list.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  };

  const renderStep = (step) => (
    <div key={step.step} className="rounded-[16px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Step {step.step}: {step.title}</h3>
          <p className="text-sm text-slate-600">{step.description}</p>
        </div>
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
          {step.duration || "No duration"}
        </span>
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">Actions</p>
          {renderList(step.actions)}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Checkpoints</p>
          {renderList(step.checkpoints)}
        </div>
      </div>
      {(step.tools?.length || step.products?.length) && (
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">Tools</p>
            {renderList(step.tools)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Products</p>
            {step.products?.length ? (
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                {step.products.map((product, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{product.name}</span>
                    {product.brand ? ` (${product.brand})` : ""}
                    {product.usage ? ` — ${product.usage}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No products required.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
      <div className="rounded-[16px] border border-primaryGray bg-white p-5">
        <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
            >
            <FiArrowLeft size={20} />
        </button>

        {loading ? (
          <div className="p-8 text-center text-slate-600">Loading SOP details...</div>
        ) : sop ? (
          <div className="space-y-6">
            <div className="rounded-[16px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{sop.name || "SOP Details"}</h2>
                  <p className="text-sm text-slate-600 mt-2">{sop.description || "No description available."}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {sop.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {sop.category || "No category"}
                  </span>
                  {sop.subCategory && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {sop.subCategory}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Duration</p>
                  <p className="text-sm font-medium text-slate-900">{sop.totalDuration || "-"}</p>
                </div>
                {/* <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Created</p>
                  <p className="text-sm font-medium text-slate-900">{new Date(sop.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Updated</p>
                  <p className="text-sm font-medium text-slate-900">{new Date(sop.updatedAt).toLocaleDateString()}</p>
                </div> */}
              </div>
            </div>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">Steps</h3>
              <div className="space-y-4">
                {sop.steps?.length ? sop.steps.map(renderStep) : <p className="text-sm text-slate-500">No steps available.</p>}
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-[16px] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-900">Hygiene</h3>
                {renderList(sop.hygiene)}
              </div>
              <div className="rounded-[16px] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-900">Quality Checks</h3>
                {renderList(sop.qualityChecks)}
              </div>
              <div className="rounded-[16px] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-900">Upsell Suggestions</h3>
                {renderList(sop.upsellSuggestions)}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">SOP details not available.</div>
        )}
      </div>
  );
};

export default SopDetail;
