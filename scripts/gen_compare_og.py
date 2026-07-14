from PIL import Image, ImageDraw, ImageFont

W,H = 1200,630
# diagonal gradient from #1e3a8a to #2563eb
c1=(30,58,138); c2=(37,99,235)
img=Image.new("RGB",(W,H))
px=img.load()
for y in range(H):
    for x in range(W):
        t=(x/W + y/H)/2
        px[x,y]=(int(c1[0]+(c2[0]-c1[0])*t),int(c1[1]+(c2[1]-c1[1])*t),int(c1[2]+(c2[2]-c1[2])*t))
d=ImageDraw.Draw(img)
def font(sz,bold=True):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
              "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"]:
        try: return ImageFont.truetype(p,sz)
        except: pass
    return ImageFont.load_default()
def center(txt,y,f,fill):
    b=d.textbbox((0,0),txt,font=f); w=b[2]-b[0]
    d.text(((W-w)//2,y),txt,font=f,fill=fill)
center("After Closing Pro",180,font(76,True),(255,255,255))
center("vs. Other Warranty Software",290,font(40,True),(219,234,254))
center("Honest, sourced comparisons for homebuilders",380,font(28,False),(191,219,254))
center("afterclosingpro.com/compare",450,font(24,False),(147,197,253))
img.save("public/og/compare.png")
print("saved")
