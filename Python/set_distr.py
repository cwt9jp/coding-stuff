from PIL import Image

im = Image.open('set_pngs/set_cards.png')

# pix = im.load()
# gray_list = []

# print(im.size)

# for i in range(im.size[1]):
#                 if pix[100, i][:-1] != (255, 255, 255):
#                         gray_list.append(i)
       
# print(gray_list)
# print(len(gray_list))

# for i in range(9):
#         print(border_list_x[2 * i + 1] - border_list_x[2 * i])


y = [13, 66, 71, 124, 128, 181, 186, 239, 243, 296, 300, 353, 358, 411, 415, 468, 473, 526]
x = [28, 124, 131, 227, 233, 329, 336, 432, 438, 534, 541, 637, 644, 740, 746, 842, 849, 945]

for i in range(9):
    
    for j in range(9):

        card_name = f'{i % 3 + 1}' # card name stuff

        if j in range(3): card_name = card_name + 'r'
        if j in range(3, 6): card_name = card_name + 'g'
        if j in range(6, 9): card_name = card_name + 'p'

        if i in range(3): card_name = card_name + 'd'
        if i in range(3, 6): card_name = card_name + 'o'
        if i in range(6, 9): card_name = card_name + 's'

        if j % 3 == 0: card_name = card_name + 'e'
        if j % 3 == 1: card_name = card_name + 'h'
        if j % 3 == 2: card_name = card_name + 'f'

        card = im.crop((x[2 * i], y[2 * j], x[2 * i + 1], y[2 * j + 1]))
        card.save(f'set_pngs/{card_name}.png')
