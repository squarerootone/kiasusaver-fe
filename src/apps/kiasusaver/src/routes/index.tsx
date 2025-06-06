import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PackageList } from "../components/PackageList";
import { routeLoader$ } from "@builder.io/qwik-city";
import { fetchFromApiServer$ } from "../utils/fetch-api";

export const usePackages = routeLoader$(async function (this: any) {
  try {
    const data = await fetchFromApiServer$.bind(this)("/api/packages");
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error?.message || String(error) };
  }
});

export default component$(() => {
  const packagesResource = usePackages();
  const { data, error } = packagesResource.value || {};
  return (
    <>
      <h1 style={{ marginTop: "2rem", marginBottom: "1rem", textAlign: "center", fontSize: "2rem", fontWeight: "bold", letterSpacing: "0.05em" }}>
        Packages List
      </h1>
      {error ? (
        <div style={{ color: 'red', textAlign: 'center', margin: '2rem 0' }}>
          Error loading packages: {error}
        </div>
      ) : Array.isArray(data) ? (
        <PackageList packages={data} />
      ) : (
        <div style={{ textAlign: "center" }}>Loading...</div>
      )}
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "kiasusaver",
      content:
        "Kiasu Saver is a web application designed to help users find the best bonus saving accounts for their saving.",
    },
  ],
};
