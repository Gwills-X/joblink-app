"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { useToasts } from "@/components/ToastProvider";

import {
  createCompanyAction,
  updateCompanyAction,
} from "@/actions/companyActions";

import { uploadMedia } from "@/services/storageService";
import { deleteMediaAction } from "@/actions/storageActions";

export default function CompanyProfileForm({ companyProfile = null }) {
  const { addToast } = useToasts();

  const isEditing = Boolean(companyProfile?.id);

  // ---------------------------------------------------------
  // ACTION
  // ---------------------------------------------------------

  const action = isEditing
    ? updateCompanyAction.bind(null, companyProfile.id)
    : createCompanyAction;

  const initialState = {
    success: false,
    message: "",
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  // ---------------------------------------------------------
  // LOGO STATE
  // ---------------------------------------------------------

  const [logoPreview, setLogoPreview] = useState(
    companyProfile?.logo_url || "",
  );

  const [logoUrl, setLogoUrl] = useState(companyProfile?.logo_url || "");

  const [logoPublicId, setLogoPublicId] = useState(
    companyProfile?.logo_public_id || "",
  );

  const [logoFileType, setLogoFileType] = useState(
    companyProfile?.logo_file_type || "image",
  );

  const [logoFormat, setLogoFormat] = useState(
    companyProfile?.logo_format || "",
  );

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const logoPublicIdRef = useRef(companyProfile?.logo_public_id || null);

  // ---------------------------------------------------------
  // TOASTS
  // ---------------------------------------------------------

  useEffect(() => {
    if (!state) return;

    if (state.success && state.message) {
      addToast({
        type: "success",
        message: state.message,
      });
    }

    if (!state.success && state.message) {
      addToast({
        type: "error",
        message: state.message,
      });
    }
  }, [state, addToast]);

  // ---------------------------------------------------------
  // LOGO UPLOAD
  // ---------------------------------------------------------

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast({
        type: "error",
        message: "Please select a valid image file.",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: "error",
        message: "Company logo must be less than 5MB.",
      });

      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setLogoPreview(previewUrl);
    setUploadingLogo(true);

    try {
      const { url, publicId, fileType, format } = await uploadMedia(file);

      setLogoUrl(url || "");
      setLogoPublicId(publicId || "");
      setLogoFileType(fileType || "image");
      setLogoFormat(format || "");

      logoPublicIdRef.current = publicId || null;

      addToast({
        type: "success",
        message: "Company logo uploaded successfully.",
      });
    } catch (error) {
      console.error("Company logo upload failed:", error);

      setLogoUrl(companyProfile?.logo_url || "");
      setLogoPublicId(companyProfile?.logo_public_id || "");
      setLogoFileType(companyProfile?.logo_file_type || "image");
      setLogoFormat(companyProfile?.logo_format || "");

      setLogoPreview(companyProfile?.logo_url || "");

      logoPublicIdRef.current = companyProfile?.logo_public_id || null;

      addToast({
        type: "error",
        message: error?.message || "Failed to upload company logo.",
      });

      event.target.value = "";
    } finally {
      setUploadingLogo(false);
    }
  };

  // ---------------------------------------------------------
  // REMOVE LOGO
  // ---------------------------------------------------------

  const handleRemoveLogo = async () => {
    try {
      if (logoPublicIdRef.current) {
        await deleteMediaAction(
          logoPublicIdRef.current,
          logoFileType || "image",
        );
      }

      setLogoPreview("");
      setLogoUrl("");
      setLogoPublicId("");
      setLogoFileType("image");
      setLogoFormat("");

      logoPublicIdRef.current = null;

      addToast({
        type: "success",
        message: "Company logo removed.",
      });
    } catch (error) {
      console.error("Company logo deletion failed:", error);

      addToast({
        type: "error",
        message: "Failed to remove company logo.",
      });
    }
  };

  // ---------------------------------------------------------
  // FORM
  // ---------------------------------------------------------

  return (
    <div className='rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8'>
      <form action={formAction} className='space-y-6'>
        {/* COMPANY NAME */}
        <div>
          <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
            Company Name <span className='text-rose-400'>*</span>
          </label>

          <input
            name='name'
            defaultValue={companyProfile?.name || ""}
            required
            disabled={isPending}
            placeholder='TechNova Solutions'
            className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50'
          />

          {state?.errors?.name && (
            <p className='mt-1 text-xs text-rose-400'>{state.errors.name[0]}</p>
          )}
        </div>

        {/* TAGLINE */}
        <div>
          <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
            Tagline
          </label>

          <input
            name='tagline'
            defaultValue={companyProfile?.tagline || ""}
            disabled={isPending}
            placeholder='Building digital solutions for a smarter future'
            className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50'
          />
        </div>

        {/* INDUSTRY */}
        <div>
          <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
            Industry
          </label>

          <input
            name='industry'
            defaultValue={companyProfile?.industry || ""}
            disabled={isPending}
            placeholder='Information Technology'
            className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50'
          />
        </div>

        {/* LOCATION */}
        <div>
          <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
            Company Location
          </label>

          <input
            name='location'
            defaultValue={companyProfile?.location || ""}
            disabled={isPending}
            placeholder='Abuja, Nigeria'
            className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50'
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
            Company Description
          </label>

          <textarea
            name='description'
            defaultValue={companyProfile?.description || ""}
            rows={6}
            disabled={isPending}
            placeholder='Describe your company, your mission, the services you provide, and the type of talent you are looking to hire.'
            className='block w-full resize-y rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50'
          />
        </div>

        {/* WEBSITE */}
        <div>
          <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
            Company Website
          </label>

          <input
            type='url'
            name='website_url'
            defaultValue={
              companyProfile?.website_url || companyProfile?.website || ""
            }
            disabled={isPending}
            placeholder='https://example.com'
            className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50'
          />
        </div>

        {/* COMPANY LOGO */}
        <div>
          <label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400'>
            Company Logo
          </label>

          <input
            type='file'
            accept='image/png,image/jpeg,image/jpg,image/webp'
            onChange={handleLogoChange}
            disabled={uploadingLogo || isPending}
            className='block w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-3 file:py-2 file:text-xs file:font-medium file:text-slate-950 hover:file:bg-emerald-400 disabled:opacity-50'
          />

          {uploadingLogo && (
            <p className='mt-2 animate-pulse font-mono text-xs text-emerald-400'>
              Uploading company logo to Cloudinary...
            </p>
          )}

          {logoPreview && (
            <div className='mt-4 flex items-center gap-4'>
              <div className='h-20 w-20 overflow-hidden rounded-xl border border-slate-700 bg-slate-950'>
                <img
                  src={logoPreview}
                  alt='Company logo preview'
                  className='h-full w-full object-cover'
                />
              </div>

              <div>
                <p className='text-xs font-medium text-slate-300'>
                  Company Logo
                </p>

                <p className='mt-1 text-[10px] text-slate-500'>
                  {uploadingLogo
                    ? "Uploading..."
                    : logoUrl
                      ? "Uploaded successfully"
                      : "Current logo"}
                </p>

                {logoUrl && !uploadingLogo && (
                  <button
                    type='button'
                    onClick={handleRemoveLogo}
                    className='mt-2 font-mono text-[11px] text-rose-400 underline hover:text-rose-300'>
                    Remove Logo
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CLOUDINARY DATA */}
        <input type='hidden' name='logo_url' value={logoUrl || ""} readOnly />

        <input
          type='hidden'
          name='logo_public_id'
          value={logoPublicId || ""}
          readOnly
        />

        <input
          type='hidden'
          name='logo_file_type'
          value={logoFileType || ""}
          readOnly
        />

        <input
          type='hidden'
          name='logo_format'
          value={logoFormat || ""}
          readOnly
        />

        {/* SERVER ERROR */}
        {state?.errors?.server && (
          <div className='rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3'>
            <p className='text-xs text-rose-400'>{state.errors.server[0]}</p>
          </div>
        )}

        {/* SUBMIT */}
        <div className='flex items-center justify-end border-t border-slate-800 pt-5'>
          <button
            type='submit'
            disabled={isPending || uploadingLogo}
            className='rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-slate-950 transition-all duration-150 hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'>
            {uploadingLogo
              ? "Uploading Logo..."
              : isPending
                ? isEditing
                  ? "Updating Company..."
                  : "Creating Company..."
                : isEditing
                  ? "Update Company"
                  : "Create Company"}
          </button>
        </div>
      </form>
    </div>
  );
}
