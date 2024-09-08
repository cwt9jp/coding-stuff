from tkinter import *
from tkinter import ttk
from itertools import combinations

root = Tk()
button_c = 2

def sigma(*args):
    global button_c
    ttk.Button(root, text='myButton', command=sigma).grid(row=button_c, column=0)
    button_c += 1

combobox_val = StringVar()
def skibidi(*args):
    label_val.set(f"The combobox reads {combobox_val.get()}")

button = ttk.Button(root, text='myButton', command=sigma)
button.grid(row=0, column=0)

combobox = ttk.Combobox(root, textvariable=combobox_val, values=('', '1', '2', '123456765432'))
combobox.bind('<<ComboboxSelected>>', skibidi)
combobox.grid(row=0, column=1)

label_val = StringVar(value='Change the combobox')
label = ttk.Label(root, textvariable=label_val, image=PhotoImage(file='set_pngs/3rsf.png'))
label.grid(row=1, column=0)

a = []
for i in range(6): a.append(StringVar(value=str(i)))
a.append(StringVar(value=str(1)))
for i in combinations(a, 2):
    if i[0].get() == i[1].get(): print(i[0].get(), i[1].get())
root.mainloop()