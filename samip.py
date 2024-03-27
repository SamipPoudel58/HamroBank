
from keras.preprocessing import image
import numpy as np
import tensorflow as tf

# loaded = keras.models.load_model("my_model.keras",safe_mode=False)
loaded = tf.keras.models.load_model("saved_model/my_model")



img_original = 'images/signa.png'
img_forged = 'images/signb.png'

x = image.load_img(img_original, target_size=(100, 100))
x = image.img_to_array(x)
x = tf.image.rgb_to_grayscale(x)
x = np.expand_dims(x, axis=0)
x = x/255.0

y = image.load_img(img_forged, target_size=(100, 100))
y = image.img_to_array(y)
y = tf.image.rgb_to_grayscale(y)
y = np.expand_dims(y, axis=0)
y = y/255.0
y_pred = loaded.predict([x,y])
y_pred = np.argmax(y_pred)

if y_pred==1:
  print('Forged')
else:
  print('Real')