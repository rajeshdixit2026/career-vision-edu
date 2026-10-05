import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, NotebookPen, Plus } from "lucide-react";
import { apiPost } from "@/lib/api";
import type { Lead } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function formatNoteDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Per-enquiry call notes: a dialog listing past notes plus a box to add another. */
export default function LeadNotesDialog({ lead }: { lead: Lead }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const addNote = useMutation({
    mutationFn: (value: string) => apiPost<Lead>(`/admin/leads/${lead.id}/notes`, { text: value }),
    onSuccess: () => {
      toast.success("Note saved", { description: lead.name });
      setText("");
      void queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
    },
    onError: () => toast.error("Could not save note", { description: "Please try again." }),
  });

  const notes = lead.notes ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        data-testid={`admin-notes-btn-${lead.id}`}
        aria-label={`Notes for ${lead.name}`}
        className="relative flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-navy hover:text-white"
      >
        <NotebookPen className="size-3.5" />
        {notes.length > 0 && (
          <span
            data-testid={`admin-notes-count-${lead.id}`}
            className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-navy"
          >
            {notes.length}
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg" data-testid="admin-notes-dialog">
        <DialogTitle className="font-heading text-lg font-bold">Call notes — {lead.name}</DialogTitle>
        <DialogDescription className="text-sm">
          {lead.phone}
          {lead.course_interest ? ` · ${lead.course_interest}` : ""}
        </DialogDescription>

        <div className="mt-4 space-y-3">
          {notes.length === 0 ? (
            <p
              data-testid="admin-notes-empty"
              className="rounded-xl border border-dashed border-slate-300 bg-muted/40 p-5 text-center text-sm text-muted-foreground"
            >
              No notes yet. Add what you discussed on the call.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {notes
                .slice()
                .reverse()
                .map((note) => (
                  <li
                    key={note.id}
                    data-testid={`admin-note-item-${note.id}`}
                    className="rounded-xl border-l-3 border-gold bg-muted/50 px-3.5 py-2.5"
                    style={{ borderLeftWidth: "3px" }}
                  >
                    <p className="text-sm leading-relaxed text-foreground">{note.text}</p>
                    <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                      {formatNoteDate(note.created_at)}
                    </p>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (text.trim() && !addNote.isPending) addNote.mutate(text.trim());
          }}
        >
          <Textarea
            data-testid="admin-note-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Called at 4pm — interested in B.Sc Nursing, will visit office Saturday."
            rows={3}
          />
          <Button
            type="submit"
            data-testid="admin-note-save-btn"
            disabled={addNote.isPending || !text.trim()}
            className="press w-full gap-2 rounded-full bg-gold font-bold text-navy hover:bg-[#ffdd5c]"
          >
            {addNote.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Plus className="size-4" /> Add Note
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
