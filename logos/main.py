import cv2
import os
import zipfile

# 1. Load the image
image_path = '7_logos_combined.jpg'
image = cv2.imread(image_path)

if image is None:
    print("Error: Could not read image.")
    exit()

# 2. Grayscale and Heavy Blur 
# A 21x21 blur smears the dark text into the white cards, removing internal edges
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blur = cv2.GaussianBlur(gray, (21, 21), 0)

# 3. Adaptive Thresholding
# This highlights the local contrast (the drop shadows of the cards) 
# and ignores the gradual gradient of the background.
thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, 
                               cv2.THRESH_BINARY_INV, 51, 10)

# 4. Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# 5. Sort contours by area (largest to smallest)
# The white logo cards will be the largest enclosed shapes on the poster
contours = sorted(contours, key=cv2.contourArea, reverse=True)

output_dir = 'extracted_logos'
os.makedirs(output_dir, exist_ok=True)

saved_files = []
logo_count = 1
img_area = image.shape[0] * image.shape[1]

# 6. Loop through and extract the top 7
for contour in contours:
    x, y, w, h = cv2.boundingRect(contour)
    area = w * h
    aspect_ratio = w / float(h)
    
    # Relaxed filter: Look for medium-large blocks that are roughly rectangular
    if 1.0 < aspect_ratio < 4.0 and 5000 < area < (img_area * 0.2):
        
        # Crop slightly inside the bounding box (padding = 3 pixels) 
        # to ensure we don't include the gray drop shadow in the final extraction
        padding = 3
        roi = image[y+padding : y+h-padding, x+padding : x+w-padding]
        
        if roi.shape[0] > 0 and roi.shape[1] > 0:
            file_name = f'{output_dir}/logo_{logo_count}.jpg'
            cv2.imwrite(file_name, roi)
            saved_files.append(file_name)
            logo_count += 1
            
    # We know there are exactly 7 logos, so break once we have them all
    if logo_count > 7:
        break

# 7. Zip the extracted logos
if saved_files:
    zip_filename = 'extracted_logos.zip'
    with zipfile.ZipFile(zip_filename, 'w') as zipf:
        for file in saved_files:
            zipf.write(file, os.path.basename(file))
    print(f"Success! Extracted {len(saved_files)} logos to {zip_filename}")
else:
    print("Failed to extract logos.")
    