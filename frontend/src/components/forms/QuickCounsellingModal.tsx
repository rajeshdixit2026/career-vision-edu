import { GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

interface QuickCounsellingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** "Book Free Counselling" modal — opens from the hero and CTA bands. */
export default function QuickCounsellingModal({ open, onOpenChange }: QuickCounsellingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" data-testid="quick-counselling-modal">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold text-navy">
            <GraduationCap className="size-5" />
          </span>
          <div>
            <DialogTitle className="font-heading text-xl font-bold">
              Book Your Free Counselling Session
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm">
              Leave your details — a senior counselor calls you back within 24 hours.
            </DialogDescription>
          </div>
        </div>
        <div className="mt-5">
          <LeadCaptureForm source="counselling" showCourseField showMessage submitLabel="Book Free Counselling" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
