"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Proposal, ZoneColor } from "@/lib/types";
import { zoneColor } from "@/lib/colors";
import { IconButton, ConfirmDialog } from "./ui";
import { ProposalModal, LinkModal, PromoteModal } from "./forms";
import { deleteProposal, deleteProposalLink } from "@/lib/actions";

export function ProposalItem({
  proposal,
  color,
  editor,
}: {
  proposal: Proposal;
  color: ZoneColor;
  editor: boolean;
}) {
  const router = useRouter();
  const c = zoneColor(color);
  const [editing, setEditing] = useState(false);
  const [addLink, setAddLink] = useState(false);
  const [editLink, setEditLink] = useState<{ id: string; label: string; url: string } | null>(null);
  const [promote, setPromote] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [delLink, setDelLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function doDelete() {
    setBusy(true);
    await deleteProposal(proposal.id);
    setBusy(false);
    setConfirmDel(false);
    router.refresh();
  }
  async function removeLink(id: string) {
    setBusy(true);
    await deleteProposalLink(id);
    setBusy(false);
    setDelLink(null);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-stone-300 bg-white p-3 shadow-sm dark:border-stone-700 dark:bg-stone-900/40">
      <div className="flex items-start gap-2">
        <span className={"mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full " + c.dot} />
        <div className="min-w-0 flex-1">
          {proposal.titulo ? (
            <>
              <p className="text-sm font-semibold leading-snug text-stone-800 dark:text-stone-200">
                {proposal.titulo}
              </p>
              {proposal.texto && (
                <p className="mt-0.5 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                  {proposal.texto}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
              {proposal.texto}
            </p>
          )}

          {(proposal.links.length > 0 || editor) && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {proposal.links.map((l) => (
                <span key={l.id} className="inline-flex items-center">
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
                  >
                    🔗 {l.label}
                  </a>
                  {editor && (
                    <>
                      <button
                        onClick={() => setEditLink({ id: l.id, label: l.label, url: l.url })}
                        aria-label="Editar link"
                        className="ml-1 text-xs text-stone-400 hover:text-stone-700"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDelLink(l.id)}
                        aria-label="Quitar link"
                        className="ml-0.5 text-stone-400 hover:text-rose-600"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </span>
              ))}
              {editor && (
                <button
                  onClick={() => setAddLink(true)}
                  className="rounded-full border border-dashed border-stone-300 px-2.5 py-1 text-xs font-medium text-stone-500 transition hover:border-stone-400 dark:border-stone-700"
                >
                  🔗 Link
                </button>
              )}
            </div>
          )}
        </div>

        {editor && (
          <div className="flex shrink-0 gap-1">
            <IconButton title="Promover a actividad" onClick={() => setPromote(true)}>
              ⤴️
            </IconButton>
            <IconButton title="Editar" onClick={() => setEditing(true)}>
              ✏️
            </IconButton>
            <IconButton title="Eliminar" variant="danger" onClick={() => setConfirmDel(true)}>
              🗑️
            </IconButton>
          </div>
        )}
      </div>

      {editing && <ProposalModal proposal={proposal} onClose={() => setEditing(false)} />}
      {addLink && <LinkModal target="proposal" id={proposal.id} onClose={() => setAddLink(false)} />}
      {editLink && (
        <LinkModal target="proposal" id={proposal.id} link={editLink} onClose={() => setEditLink(null)} />
      )}
      {promote && (
        <PromoteModal
          proposalId={proposal.id}
          texto={proposal.titulo || proposal.texto}
          onClose={() => setPromote(false)}
        />
      )}
      {confirmDel && (
        <ConfirmDialog
          title="Eliminar propuesta"
          message="¿Seguro que querés eliminar esta propuesta?"
          onConfirm={doDelete}
          onClose={() => setConfirmDel(false)}
          pending={busy}
        />
      )}
      {delLink && (
        <ConfirmDialog
          title="Quitar link"
          message="¿Quitar este link?"
          confirmLabel="Quitar"
          onConfirm={() => removeLink(delLink)}
          onClose={() => setDelLink(null)}
          pending={busy}
        />
      )}
    </div>
  );
}
