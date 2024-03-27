from django.http import JsonResponse
from keras.preprocessing import image
import tensorflow as tf
import numpy as np

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ChequeSerializer
import os

model = tf.keras.models.load_model("saved_model/my_model")

@api_view(['POST'])
def check_forgery(request):
    if request.method == 'POST':
        serializer = ChequeSerializer(data=request.data)
        if serializer.is_valid():
            image1 = serializer.validated_data['image1']
            image2 = serializer.validated_data['image2']
            image1_path = save_image(image1)
            image2_path = save_image(image2)

            print(image1_path,image2_path)
            

            x = image.load_img(image1_path, target_size=(100, 100))
            x = image.img_to_array(x)
            x = tf.image.rgb_to_grayscale(x)
            x = np.expand_dims(x, axis=0)
            x = x/255.0

            y = image.load_img(image2_path, target_size=(100, 100))
            y = image.img_to_array(y)
            y = tf.image.rgb_to_grayscale(y)
            y = np.expand_dims(y, axis=0)
            y = y/255.0
            y_pred = model.predict([x,y])
            confidence = np.max(y_pred)
            print(y_pred)
            print(confidence)
            y_pred = np.argmax(y_pred)

            result = ''

            if y_pred==1:
                result = 'forged'
                print('forged')
            else:
                result = 'real'
                print('real')
            return Response({"status": result,"confidence":float(confidence*100)})

def save_image(image):
    # Define your image saving logic here, for example, save it in the media directory
    image_dir = 'media/signatures/'
    os.makedirs(image_dir, exist_ok=True)
    image_path = os.path.join(image_dir, image.name)
    with open(image_path, 'wb+') as destination:
        for chunk in image.chunks():
            destination.write(chunk)
    return image_path