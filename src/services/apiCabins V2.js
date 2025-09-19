import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;
}

export async function createCabin(newCabin) {
  let imagePath = newCabin.image;

  if (newCabin.image instanceof File) {
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
      "/",
      ""
    );

    const filePath = `public/${imageName}`;

    // 1. create cabin
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(filePath, newCabin.image);
    console.log("newCabin.image:", newCabin.image);
    console.log("is File?", newCabin.image instanceof File);
    if (storageError) throw new Error("Cabin image could not be uploaded");

    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${filePath}`;
  }

  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }])
    .select()
    .single();

  if (error) throw new Error("Cabins could not be created");
  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    throw new Error("Cabins could not be deleted");
  }
}
