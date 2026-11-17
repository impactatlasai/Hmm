import React, { useEffect, useState } from 'react';
import { Download, PlusSquare, Share, Sparkles, X } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';
import { AtlasLogoIcon } from '../AtlasLogoIcon';

export function PWAInstallNotification(): React.ReactElement | null {
  const { isInstallable, isInstalled, isIOS, isStandalone, promptInstall } = usePWAInstall();
  const [visible, setVisible] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // If running in standalone or already installed, do not show
    if (isStandalone || isInstalled) {
      return;
    }

    // Check if dismissed in this session
    try {
      const isDismissed = sessionStorage.getItem('atlas_pwa_notification_dismissed');
      if (isDismissed === 'true') {
        return;
      }
    } catch {
      // Ignore sessionStorage issues
    }

    // EXACT REQUIREMENT: Show notification 3 seconds after entering the site ("site e dukhar 3 sec pore")
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isStandalone, isInstalled]);

  const handleDismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem('atlas_pwa_notification_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    const outcome = await promptInstall();
    if (outcome === 'accepted') {
      setInstalledSuccess(true);
      setTimeout(() => {
        setVisible(false);
      }, 2000);
    } else if (outcome === 'ios') {
      setShowIOSGuide(true);
    }
  };

  if (!visible || isStandalone || isInstalled) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-desc"
      className="fixed z-50 transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-6 bottom-20 md:bottom-6 right-3 left-3 md:left-auto md:right-6 md:w-[410px]"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#0056D2]/25 bg-white/95 p-4 shadow-[0_12px_45px_rgba(11,31,75,0.18)] backdrop-blur-md">
        {/* Top gradient micro-bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0056D2] via-[#00A3FF] to-[#0B1F4B]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="বিজ্ঞপ্তি বন্ধ করুন (Close notification)"
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0056D2]/30"
        >
          <X className="h-4 w-4" />
        </button>

        {installedSuccess ? (
          <div className="flex items-center gap-3 py-2 text-[#0056D2]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-emerald-800">অ্যাপ সফলভাবে ইনস্টল হয়েছে!</p>
              <p className="text-xs text-slate-500">আপনার হোম স্ক্রিন বা অ্যাপ ড্রয়ারে যোগ করা হয়েছে।</p>
            </div>
          </div>
        ) : showIOSGuide ? (
          /* iOS Safari 2-Step Instruction */
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0056D2]/10 text-[#0056D2]">
                <Share className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B1F4B]">iOS Safari-তে ইনস্টল করার নিয়ম</h3>
                <p className="text-xs text-slate-500">সহজ ২ ধাপে হোম স্ক্রিনে যোগ করুন</p>
              </div>
            </div>

            <ol className="space-y-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0056D2] text-[10px] font-bold text-white">
                  ১
                </span>
                <span>
                  সাফারির নিচের বারে থাকা <strong>Share</strong> বোতামে (<Share className="inline h-3.5 w-3.5 text-[#0056D2]" />) চাপ দিন।
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0056D2] text-[10px] font-bold text-white">
                  ২
                </span>
                <span>
                  নিচে স্ক্রল করে <strong>&quot;Add to Home Screen&quot;</strong> (<PlusSquare className="inline h-3.5 w-3.5 text-[#0056D2]" />) বেছে নিন এবং <strong>Add</strong> চাপুন।
                </span>
              </li>
            </ol>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-lg bg-[#0056D2] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0046AB]"
              >
                বুঝেছি (Got it)
              </button>
            </div>
          </div>
        ) : (
          /* Standard Install Prompt Card */
          <div>
            <div className="flex items-start gap-3">
              {/* App Icon */}
              <div className="relative shrink-0">
                <div className="flex h-13 w-13 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1F4B] to-[#0056D2] p-1.5 shadow-md ring-2 ring-[#0056D2]/20">
                  <img
                    src="/pwa-192x192.png"
                    alt="Atlas AI Education App Icon"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      // Fallback to vector component if raster fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
                    <AtlasLogoIcon size={34} />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </div>

              {/* Title & Badge */}
              <div className="min-w-0 flex-1 pr-5">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-md bg-[#0056D2]/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-[#0056D2] uppercase">
                    Official Web App
                  </span>
                </div>
                <h3
                  id="pwa-install-title"
                  className="mt-0.5 text-sm font-bold tracking-tight text-[#0B1F4B]"
                >
                  Atlas AI Education App
                </h3>
                <p
                  id="pwa-install-desc"
                  className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2"
                >
                  হোম স্ক্রিনে ইনস্টল করুন — দ্রুত অ্যাক্সেস, অফলাইন সাপোর্ট ও উন্নত লার্নিং এক্সপেরিয়েন্স।
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-3.5 flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                পরে (Later)
              </button>
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0056D2] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#0046AB] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#0056D2]/40"
              >
                <Download className="h-3.5 w-3.5" />
                <span>ইনস্টল করুন (Install Now)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
