import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  let imagePath = newCabin.image;

  if (!hasImagePath && newCabin.image) {
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
      "/",
      ""
    );
    const filePath = `public/${imageName}`;
    const { data: uploadData, error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(filePath, newCabin.image, {
        cacheControl: "3600",
        upsert: false,
      });

    console.log("Upload response:", uploadData, storageError);

    if (storageError) {
      throw new Error("Cabin image could not be uploaded");
    }

    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/public/${imageName}`;
  }

  // 1. create / edit cabin
  let query = supabase.from("cabins");

  // Create cabin
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // Edit cabin
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();
  if (error) throw new Error("Cabins could not be created");

  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    throw new Error("Cabins could not be deleted");
  }
}
