use image::codecs::jpeg::JpegEncoder;
use image::ExtendedColorType;
use image::{DynamicImage, ImageError, ImageFormat, ImageReader};
use serde::{Deserialize, Serialize};
use std::io::Cursor;
use webp::Encoder;

#[derive(Debug, thiserror::Error)]
pub enum CommandError {
    #[error("Image error: {0}")]
    Image(#[from] ImageError),
    #[error("Failed to encode WebP: {0}")]
    WebpEncode(String),
    #[error("Unsupported image format")]
    UnsupportedFormat,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum ImageResult {
    Png(Vec<u8>),
    Jpeg(Vec<u8>),
    Webp(Vec<u8>),
    Gif(Vec<u8>),
    Ico(Vec<u8>),
    Bmp(Vec<u8>),
    Tiff(Vec<u8>),
    Pnm(Vec<u8>),
    Dds(Vec<u8>),
    Tga(Vec<u8>),
    Hdr(Vec<u8>),
    Farbfeld(Vec<u8>),
    Avif(Vec<u8>),
    Qoi(Vec<u8>),
}

impl ImageResult {
    fn to_bytes(&self) -> Vec<u8> {
        match self {
            ImageResult::Png(data)
            | ImageResult::Jpeg(data)
            | ImageResult::Webp(data)
            | ImageResult::Gif(data)
            | ImageResult::Ico(data)
            | ImageResult::Bmp(data)
            | ImageResult::Tiff(data)
            | ImageResult::Pnm(data)
            | ImageResult::Dds(data)
            | ImageResult::Tga(data)
            | ImageResult::Hdr(data)
            | ImageResult::Farbfeld(data)
            | ImageResult::Avif(data)
            | ImageResult::Qoi(data) => data.clone(),
        }
    }

    fn from_image_and_format(img: DynamicImage, format: ImageFormat, quality: u8) -> Result<Self, CommandError> {
        let mut buffer = Cursor::new(Vec::new());
        match format {
            ImageFormat::Png => {
                img.write_to(&mut buffer, ImageFormat::Png)?;
                Ok(ImageResult::Png(buffer.into_inner()))
            }
            ImageFormat::Jpeg => {
                let rgb = img.to_rgb8();
                let w = rgb.width();
                let h = rgb.height();
                let raw = rgb.into_raw();
                let mut jpeg_buf = Vec::new();
                let mut encoder = JpegEncoder::new_with_quality(&mut jpeg_buf, quality);
                encoder.encode(&raw, w, h, ExtendedColorType::Rgb8)?;
                Ok(ImageResult::Jpeg(jpeg_buf))
            }
            ImageFormat::WebP => {
                let rgba = img.to_rgba8();
                let w = rgba.width();
                let h = rgba.height();
                let encoder = Encoder::new(&rgba, webp::PixelLayout::Rgba, w, h);
                let webp_data = encoder.encode(quality as f32);
                Ok(ImageResult::Webp(webp_data.to_vec()))
            }
            ImageFormat::Gif => {
                img.write_to(&mut buffer, ImageFormat::Gif)?;
                Ok(ImageResult::Gif(buffer.into_inner()))
            }
            ImageFormat::Ico => {
                img.write_to(&mut buffer, ImageFormat::Ico)?;
                Ok(ImageResult::Ico(buffer.into_inner()))
            }
            ImageFormat::Bmp => {
                img.write_to(&mut buffer, ImageFormat::Bmp)?;
                Ok(ImageResult::Bmp(buffer.into_inner()))
            }
            ImageFormat::Tiff => {
                img.write_to(&mut buffer, ImageFormat::Tiff)?;
                Ok(ImageResult::Tiff(buffer.into_inner()))
            }
            ImageFormat::Pnm => {
                img.write_to(&mut buffer, ImageFormat::Pnm)?;
                Ok(ImageResult::Pnm(buffer.into_inner()))
            }
            ImageFormat::Dds => {
                img.write_to(&mut buffer, ImageFormat::Dds)?;
                Ok(ImageResult::Dds(buffer.into_inner()))
            }
            ImageFormat::Tga => {
                img.write_to(&mut buffer, ImageFormat::Tga)?;
                Ok(ImageResult::Tga(buffer.into_inner()))
            }
            ImageFormat::Hdr => {
                img.write_to(&mut buffer, ImageFormat::Hdr)?;
                Ok(ImageResult::Hdr(buffer.into_inner()))
            }
            ImageFormat::Farbfeld => {
                img.write_to(&mut buffer, ImageFormat::Farbfeld)?;
                Ok(ImageResult::Farbfeld(buffer.into_inner()))
            }
            ImageFormat::Avif => {
                // AVIF is not directly supported by the `image` crate for writing without additional features/crates.
                // For a full implementation, consider adding another crate or a specific AVIF encoder.
                Err(CommandError::UnsupportedFormat)
            }
            ImageFormat::Qoi => {
                img.write_to(&mut buffer, ImageFormat::Qoi)?;
                Ok(ImageResult::Qoi(buffer.into_inner()))
            }
            _ => Err(CommandError::UnsupportedFormat),
        }
    }
}

#[tauri::command]
pub async fn convert_image_command(
    image_data: Vec<u8>,
    output_format: String,
) -> Result<Vec<u8>, String> {
    log::info!(
        "convert_image_command: Input size: {} bytes, Output Format: {}",
        image_data.len(),
        output_format
    );

    let format = match output_format.to_lowercase().as_str() {
        "jpeg" => ImageFormat::Jpeg,
        "png" => ImageFormat::Png,
        "webp" => ImageFormat::WebP,
        "gif" => ImageFormat::Gif,
        "ico" => ImageFormat::Ico,
        "bmp" => ImageFormat::Bmp,
        "tiff" => ImageFormat::Tiff,
        "pnm" => ImageFormat::Pnm,
        "dds" => ImageFormat::Dds,
        "tga" => ImageFormat::Tga,
        "hdr" => ImageFormat::Hdr,
        "farbfeld" => ImageFormat::Farbfeld,
        "qoi" => ImageFormat::Qoi,
        _ => return Err(CommandError::UnsupportedFormat.to_string()),
    };

    let img_reader = ImageReader::new(Cursor::new(image_data))
        .with_guessed_format()
        .map_err(|e| e.to_string())?;

    let img = img_reader.decode().map_err(|e| e.to_string())?;

    let image_result = ImageResult::from_image_and_format(img, format, 80) // Default quality for conversion if not specified
        .map_err(|e| e.to_string())?;
    let converted_bytes = image_result.to_bytes();

    log::info!(
        "convert_image_command: Output size: {} bytes",
        converted_bytes.len()
    );

    Ok(converted_bytes)
}