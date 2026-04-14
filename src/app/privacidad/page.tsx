import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#0a0a1a" }}>
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bg-privacidad.jpg')",
          filter: "brightness(0.25)",
        }}
      />
      <div className="relative z-10 min-h-screen flex items-start py-10 px-4 sm:px-6 lg:px-8" style={{ paddingLeft: "50%" }}>
        <div className="w-full max-w-sm mt-[15vh]">
        <h1
          className="text-lg sm:text-xl font-bold mb-5 text-left"
          style={{
            backgroundImage: "linear-gradient(90deg, #68A542, #EAB3CB, #F5D547)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Política de Privacidad
        </h1>

        <div className="space-y-4 text-white/70 text-[11px] leading-relaxed text-left">
          <section>
            <h2 className="text-white/90 font-semibold text-xs mb-1">Responsable del Tratamiento</h2>
            <p>Zocolski Art and Music Productions S.L.</p>
            <p>Madrazo 96, Barcelona.</p>
          </section>

          <section>
            <h2 className="text-white/90 font-semibold text-xs mb-1">Finalidad del Tratamiento</h2>
            <p>
              Envío de información sobre la carrera musical de Luna Ki, incluyendo lanzamientos,
              eventos, conciertos y novedades del Makina&apos;s Club.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 font-semibold text-xs mb-1">Base Legitimadora</h2>
            <p>
              Consentimiento expreso del usuario (Art. 6.1 a del Reglamento General de Protección
              de Datos — RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-white/90 font-semibold text-xs mb-1">Ejercicio de Derechos</h2>
            <p>
              Puedes ejercer tus derechos de acceso, rectificación (Art. 16 RGPD) para corregir
              datos inexactos o incompletos, supresión, limitación y oposición enviando un correo
              electrónico a{" "}
              <a
                href="mailto:info@lunaki.com"
                className="text-[#EAB3CB] underline hover:text-[#EAB3CB]/80 transition"
              >
                info@lunaki.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 font-semibold text-xs mb-1">Baja de comunicaciones</h2>
            <p>
              Cada comunicación que recibas incluirá la opción de darte de baja del correo.
              Los datos se mantendrán mientras no se reciba una comunicación al respecto.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 font-semibold text-xs mb-1">Reclamaciones</h2>
            <p>
              Puedes presentar una reclamación ante la Agencia Española de Protección de Datos
              (AEPD) si consideras que tus derechos no han sido atendidos correctamente.
            </p>
          </section>
        </div>

        <div className="mt-6 text-left">
          <Link
            href="/registro"
            className="text-[#EAB3CB] hover:text-[#EAB3CB]/80 text-[11px] underline transition"
          >
            &larr; Volver al registro
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
