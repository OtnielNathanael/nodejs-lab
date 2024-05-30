import pyautogui as gui
import keyboard
from PIL import Image, ImageGrab
import time

def get_pixel(image, x, y):
    px = image.load()
    return px[x, y]

def start():
    x, y, width, height = 0, 102, 1920, 872
    jumping_time = 0
    last_jumping_time = 0
    current_jumping_time = 0
    last_interval_time = 0
    y_search1, y_search2, x_start, x_end = 557, 486, 400, 415
    y_search_for_bird = 460

    time.sleep(3)

    while True:
        t1 = time.time()

        if keyboard.is_pressed('q'):
            break

        sct_img = gui.screenshot(region=(x, y, width, height))
        sct_img.save("dino.jpg")

        bg_color = get_pixel(sct_img, 100, 100)

        for i in reversed(range(x_start, x_end)):
            pixel_color = get_pixel(sct_img, i, y_search1)
            if pixel_color != bg_color:
                keyboard.press('up')
                current_jumping_time = time.time()
                jumping_time = current_jumping_time - last_jumping_time
                last_jumping_time = current_jumping_time
                break

            pixel_color = get_pixel(sct_img, i, y_search2)
            if pixel_color != bg_color:
                keyboard.press('up')
                current_jumping_time = time.time()
                jumping_time = current_jumping_time - last_jumping_time
                last_jumping_time = current_jumping_time
                break

        if time.time() - last_interval_time > 0.5:
            pixel_color = get_pixel(sct_img, x_end, y_search_for_bird)
            if pixel_color != bg_color:
                keyboard.press('down')
                last_interval_time = time.time()

        time.sleep(0.001)

start()