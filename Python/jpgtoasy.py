from PIL import Image
import sys

imgpath = sys.argv[1]
outname = sys.argv[2]
size = sys.argv[3] # output image length (cm)

if outname[-4:] != '.asy':
    outname = outname + '.asy'

im = Image.open(imgpath)
pix = im.load()

try: open(outname, 'w').close()
except: pass

with open(outname, 'a') as txt:
    txt.write("guide a(int b,int c){return (b,-c)--(b+1,-c)--(b+1,-c-1)--(b,-c-1)--cycle;")
    for i in range(im.size[0]):
        for j in range(im.size[1]):
            txt.write(f"fill(a({i},{j}),rgb{pix[i,j][:-1]});")