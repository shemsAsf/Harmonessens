import path from 'path';

export const IMAGE_FOLDER = process.env.RENDER 
  ? path.join("/data", "images/services")  // Render deployment
  : path.join(process.cwd(), "data/images/services"); // Local development

