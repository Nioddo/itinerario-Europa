import { NextResponse } from "next/server";
import { codeIsValid, makeSessionValue, EDIT_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/auth  { code }  → valida el código y setea la cookie de edición.
export async function POST(req: Request) {
  let code = "";
  try {
    const body = await req.json();
    code = String(body?.code ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  if (!process.env.EDIT_CODE) {
    return NextResponse.json(
      { ok: false, error: "EDIT_CODE no está configurado en el servidor." },
      { status: 500 }
    );
  }

  if (!codeIsValid(code)) {
    return NextResponse.json({ ok: false, error: "Código incorrecto." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(EDIT_COOKIE.name, makeSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: EDIT_COOKIE.maxAge,
  });
  return res;
}

// DELETE /api/auth  → cierra el modo edición (borra la cookie).
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(EDIT_COOKIE.name, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
