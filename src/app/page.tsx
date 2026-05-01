import { createClient } from "@/utils/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { EventCategories } from "@/components/sections/event-categories";
import { PlateBuilder } from "@/components/sections/plate-builder";
import { Packages } from "@/components/sections/packages";
import { VendorsSection } from "@/components/sections/vendors";
import { ThemesSection } from "@/components/sections/themes";
import { BudgetEstimator } from "@/components/sections/budget-estimator";
import { Testimonials } from "@/components/sections/testimonials";
import { Gallery } from "@/components/sections/gallery";
import { About } from "@/components/sections/about";
import { QuoteForm } from "@/components/sections/quote-form";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { DUMMY_CATEGORIES, DUMMY_MENU_ITEMS } from "@/lib/dummyData";

async function getCategories() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    return data && data.length > 0 ? data : DUMMY_CATEGORIES;
  } catch {
    return DUMMY_CATEGORIES;
  }
}

async function getMenuItems() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("menu_items")
      .select("*, categories(name)")
      .eq("is_active", true)
      .order("created_at");
    if (data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: item.price,
        image_url: item.image_url || null,
        dietary_tags: item.dietary_tags || [],
        is_popular: item.is_popular || false,
        is_seasonal: item.is_seasonal || false,
        category_id: item.category_id,
        category_name: item.categories?.name || "",
      }));
    }
    return DUMMY_MENU_ITEMS;
  } catch {
    return DUMMY_MENU_ITEMS;
  }
}

async function getVendors() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("vendors")
      .select("*")
      .eq("is_active", true)
      .order("is_featured", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

async function getThemes() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("themes")
      .select("*")
      .eq("is_active", true);
    return data || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [categories, menuItems, vendors, themes] = await Promise.all([
    getCategories(),
    getMenuItems(),
    getVendors(),
    getThemes(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <EventCategories />
        <PlateBuilder categories={categories} menuItems={menuItems} />
        <Packages />
        {vendors.length > 0 && <VendorsSection vendors={vendors} />}
        {themes.length > 0 && <ThemesSection themes={themes} />}
        <BudgetEstimator />
        <Testimonials />
        <Gallery />
        <About />
        <QuoteForm />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
