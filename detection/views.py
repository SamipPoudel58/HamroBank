from django.http import JsonResponse
from keras.preprocessing import image
import tensorflow as tf
import numpy as np

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ChequeSerializer
import os

from users.models import User

model = tf.keras.models.load_model("saved_model/my_model")

@api_view(['POST'])
def check_forgery(request):
    if request.method == 'POST':
        serializer = ChequeSerializer(data=request.data)
        if serializer.is_valid():
            chequeImgFile = serializer.validated_data['chequeImg']
            chequeImg = save_image(chequeImgFile)

            accountNo = serializer.validated_data['accountNo']
            user = User.objects.get(id=accountNo)
            originalImg = os.path.join('media/',str(user.signImg))

            print(originalImg)

            x = image.load_img(chequeImg, target_size=(100, 100))
            x = image.img_to_array(x)
            x = tf.image.rgb_to_grayscale(x)
            x = np.expand_dims(x, axis=0)
            x = x/255.0

            y = image.load_img(originalImg, target_size=(100, 100))
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
            return Response({"originalSignImg": originalImg ,"status": result,"confidence":float(confidence*100)})
            

def save_image(image):
    # Define your image saving logic here, for example, save it in the media directory
    image_dir = 'media/signatures/'
    os.makedirs(image_dir, exist_ok=True)
    image_path = os.path.join(image_dir, image.name)
    with open(image_path, 'wb+') as destination:
        for chunk in image.chunks():
            destination.write(chunk)
    return image_path