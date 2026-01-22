/**
 * Converts a Cloudinary video URL to a thumbnail image URL
 * Uses Cloudinary's automatic video thumbnail generation
 */
export function getVideoThumbnail(videoUrl: string): string {
  if (!videoUrl || !videoUrl.includes('cloudinary.com')) {
    return ''
  }

  // Cloudinary video URL format:
  // https://res.cloudinary.com/cloud_name/video/upload/v123/folder/video.mp4
  // Thumbnail format:
  // https://res.cloudinary.com/cloud_name/video/upload/so_0,w_400,h_300,c_fill,f_jpg/v123/folder/video.mp4

  return videoUrl.replace(
    '/video/upload/',
    '/video/upload/so_0,w_640,h_360,c_fill,f_jpg,q_80/'
  )
}
