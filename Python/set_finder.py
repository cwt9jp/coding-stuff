# set order: number (1, 2, 3), color (r, g, p), shape (o, d, s), shading (f, h, e)
from tkinter import *
from tkinter import ttk, filedialog
from itertools import combinations
import sys
from os import path
from PIL import ImageTk, Image

# Directory workaround
def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = path.abspath(".")
    
    base_path = path.join(base_path, 'Python')
    return path.join(base_path, relative_path)

# Main
root = Tk()
root.iconbitmap(resource_path('set_pngs/set_ico.ico'))
root.title("Set Finder")
root.resizable(False, False)

tab_manager = ttk.Notebook(root)

tb = ttk.Frame(tab_manager)
mf = ttk.Frame(tb, padding="6 6 12 12")
mf1 = ttk.Frame(tb, padding="6 6 12 12")

tb1 = ttk.Frame(tab_manager)
mf2 = ttk.Frame(tb1, padding="6 6 12 12")

tab_manager.add(tb, text='                                     Manual                                     ')
tab_manager.add(tb1, text='                                     Photo                                     ')

# Variables

# tb
selected_button = None
cd_selected = StringVar(value='Select a card')

amt_val = StringVar()
clr_val = StringVar()
shp_val = StringVar()
shd_val = StringVar()

txt_val = StringVar()
error_msg = StringVar()

cd_btns = []
cd_vals = []

set_cd_lbls = []
set_cd_vals = []

blank_cd = PhotoImage(file=resource_path('set_pngs/----.png'))

set_list = []
viewing_set = 0

for i in range(12): cd_vals.append(StringVar(value='----'))
for i in range(3): set_cd_vals.append(StringVar(value='----'))

# tb1
cds_found_val = StringVar()

# Functions
def select_card(i):
    global selected_button
    selected_button = i

    dne_btn['state'] = 'normal'
    error_msg.set('')

    for j in cd_btns: j['state'] = 'normal'
    cd_btns[i]['state'] = 'disabled'

    amt_cmb['state'] = 'readonly'
    clr_cmb['state'] = 'readonly'
    shp_cmb['state'] = 'readonly'
    shd_cmb['state'] = 'readonly'
    txt_entr['state'] = 'normal'

    if cd_vals[i].get() == '----':
        amt_val.set('')
        clr_val.set('')
        shp_val.set('')
        shd_val.set('')

    else:
        amt_val.set(cd_vals[i].get()[0])

        if cd_vals[i].get()[1] == 'r': clr_val.set('red')
        elif cd_vals[i].get()[1] == 'g': clr_val.set('green')
        elif cd_vals[i].get()[1] == 'p': clr_val.set('purple')

        if cd_vals[i].get()[2] == 'o': shp_val.set('oval')
        elif cd_vals[i].get()[2] == 'd': shp_val.set('diamond')
        elif cd_vals[i].get()[2] == 's': shp_val.set('squiggle')

        if cd_vals[i].get()[3] == 'f': shd_val.set('filled')
        elif cd_vals[i].get()[3] == 'h': shd_val.set('half-filled')
        elif cd_vals[i].get()[3] == 'e': shd_val.set('empty')
    
    cd_selected.set(f"Editing card {selected_button + 1}")
    txt_val.set('')

def preview_card(*args):
    global selected_button

    if amt_val.get() == '' and clr_val.get() == '' and shp_val.get() == '' and shd_val.get() == '':
        cd_vals[selected_button].set('----')
        cd_btns[selected_button]['image'] = blank_cd
        cd_btns[selected_button].image = blank_cd # IMPORTANT (something to do with how python marks memory for reallocation)
        check_count()
        
    elif amt_val.get() == '' or clr_val.get() == '' or shp_val.get() == '' or shd_val.get() == '': return
    else:
        cd_name = amt_val.get()

        if clr_val.get() == 'red': cd_name = cd_name + 'r'
        elif clr_val.get() == 'green': cd_name = cd_name + 'g'
        elif clr_val.get() == 'purple': cd_name = cd_name + 'p'

        if shp_val.get() == 'oval': cd_name = cd_name + 'o'
        elif shp_val.get() == 'diamond': cd_name = cd_name + 'd'
        elif shp_val.get() == 'squiggle': cd_name = cd_name + 's'

        if shd_val.get() == 'filled': cd_name = cd_name + 'f'
        elif shd_val.get() == 'half-filled': cd_name = cd_name + 'h'
        elif shd_val.get() == 'empty': cd_name = cd_name + 'e'

        repeat_cards = False

        cd_vals_pvw = cd_vals.copy()
        del cd_vals_pvw[selected_button]
        cd_vals_pvw.insert(selected_button, StringVar(value=cd_name))

        for i in combinations(cd_vals_pvw, 2):
            if i[0].get() == '----' or i[1].get() == '---': continue
            elif i[0].get() == i[1].get():
                repeat_cards = True
                break

        if not repeat_cards:
            new_cd = PhotoImage(file=resource_path(f'set_pngs/{cd_name}.png'))
            cd_vals[selected_button].set(cd_name)
            cd_btns[selected_button]['image'] = new_cd
            cd_btns[selected_button].image = new_cd
            check_count()
            error_msg.set('')
            
        else:
            error_msg.set('Cards cannot\nbe duplicates.')

def finish_selection(*args):
    global selected_button

    amt_val.set('')
    clr_val.set('')
    shp_val.set('')
    shd_val.set('')
    txt_val.set('')

    amt_cmb['state'] = 'disabled'
    clr_cmb['state'] = 'disabled'
    shp_cmb['state'] = 'disabled'
    shd_cmb['state'] = 'disabled'
    txt_entr['state'] = 'disabled'

    if selected_button is not None: cd_btns[selected_button]['state'] = 'normal'

    dne_btn['state'] = 'disabled'
    cd_selected.set('Select a card')

    selected_button = None

def check_count():
    ''' Check the count of cards on-screen, and changes the status of the Calculate button accordingly. '''
    count = 0

    for i in cd_vals:
        if i.get() != '----': count += 1
        if count == 3:
            calc_btn['state'] = 'normal'
            return
        
        if count > 0:
            clear_btn['state'] = 'normal'

    if count < 3: calc_btn['state'] = 'disabled'
    if count < 0: clear_btn['state'] = 'disabled'

def validate_entry(newval):
    if len(newval) > 0 and newval[0] not in ('1', '2', '3'): return False
    if len(newval) > 1 and newval[1] not in ('r', 'g', 'p'): return False
    if len(newval) > 2 and newval[2] not in ('o', 'd', 's'): return False
    if len(newval) > 3 and newval[3] not in ('f', 'h', 'e'): return False
    if len(newval) > 4: return False

    return True
validate_entry_wrapper = (root.register(validate_entry), '%P')

def preview_card_entry():
    global selected_button

    cd_name = txt_val.get()
    new_cd = PhotoImage(file=resource_path(f'set_pngs/{cd_name}.png'))

    repeat_cards = False

    cd_vals_pvw = cd_vals.copy()
    del cd_vals_pvw[selected_button]
    cd_vals_pvw.insert(selected_button, StringVar(value=cd_name))

    for i in combinations(cd_vals_pvw, 2):
        if i[0].get() == '----' or i[1].get() == '---': continue
        elif i[0].get() == i[1].get():
            repeat_cards = True
            break

    if not repeat_cards:
        new_cd = PhotoImage(file=resource_path(f'set_pngs/{cd_name}.png'))
        cd_vals[selected_button].set(cd_name)
        cd_btns[selected_button]['image'] = new_cd
        cd_btns[selected_button].image = new_cd
        check_count()
        error_msg.set('')
            
    else:
        error_msg.set('Cards cannot\nbe duplicates.')

def entry_handler(*args):
    ''' Executes functions based on the length of the entry widget '''
    global selected_button

    if len(txt_val.get()) != 0:
        amt_cmb['state'] = 'disabled'
        clr_cmb['state'] = 'disabled'
        shp_cmb['state'] = 'disabled'
        shd_cmb['state'] = 'disabled'
    else:
        amt_cmb['state'] = 'readonly'
        clr_cmb['state'] = 'readonly'
        shp_cmb['state'] = 'readonly'
        shd_cmb['state'] = 'readonly'
    
    if len(txt_val.get()) == 4: preview_card_entry()

    if args[0] == True and len(txt_val.get()) == 4 and selected_button != 11:
        select_card(selected_button + 1)
        txt_val.set('')
    elif args[0] == True and len(txt_val.get()) == 4:
        select_card(0)
        txt_val.set('')

def solve_for_sets(*args):
    global set_list
    card_list = []
    set_list = []

    for i in cd_vals:
        if i.get() != '----': card_list.append(i.get())

    for i in combinations(card_list, 3):
        not_set = False

        for j in range(4):
            if ((i[0][j] == i[1][j] and i[1][j] == i[2][j]) or (i[0][j] != i[1][j] and i[0][j] != i[2][j] and i[1][j] != i[2][j])) == False:
                not_set = True
                break
        
        if not_set: continue
        set_list.append(i)
    
    if len(set_list) == 0: error_msg.set('No sets found.')
    else:
        error_msg.set(f'Found {len(set_list)} set(s).')

        for i in range(3):
            set_cd_name = set_list[0][i]
            new_cd = PhotoImage(file=resource_path(f'set_pngs/{set_cd_name}.png'))
            set_cd_vals[i].set(set_cd_name)
            set_cd_lbls[i]['image'] = new_cd
            set_cd_lbls[i].image = new_cd
        
        if len(set_list) > 1: nxt_btn['state'] = 'normal'
        
def clear_cards(*args):
    for i in cd_vals: i.set('----')
    for i in cd_btns:
        i['image'] = blank_cd
        i.image = blank_cd

    for i in set_cd_vals: i.set('----')
    for i in set_cd_lbls:
        i['image'] = blank_cd
        i.image = blank_cd

    clear_btn['state'] = 'disabled'
    error_msg.set('')
    finish_selection()

def switch_set_view(step):
    global viewing_set; viewing_set += step

    for i in range(3):
        set_cd_name = set_list[viewing_set][i]
        new_cd = PhotoImage(file=resource_path(f'set_pngs/{set_cd_name}.png'))
        set_cd_vals[i].set(set_cd_name)
        set_cd_lbls[i]['image'] = new_cd
        set_cd_lbls[i].image = new_cd
        
    if viewing_set + 1 >= len(set_list): nxt_btn['state'] = 'disabled'
    else: nxt_btn['state'] = 'normal'

    if viewing_set <= 0: bck_btn['state'] = 'disabled'
    else: bck_btn['state'] = 'normal'

def get_photo(*args):
    filepath = filedialog.askopenfilename(filetypes=[('Supported Files', '.png .jpeg .jpg .bmp .tiff .tif')])

    if filepath:
        img = Image.open(filepath)
        img = img.resize((500, int(500 * img.size[1] / img.size[0])), Image.LANCZOS)
        img = ImageTk.PhotoImage(img)

        pto_lbl['image'] = img
        pto_lbl.image = img

def merge_cards(*args):
    pass

# Widgets

# tb
cnbr_lbl = ttk.Label(mf, textvariable=cd_selected)

card_lbl = ttk.Label(mf, text='Cards')

sets_lbl = ttk.Label(mf1, text='Sets')

amt_lbl = ttk.Label(mf, text='Amount:')
clr_lbl = ttk.Label(mf, text='Color:')
shp_lbl = ttk.Label(mf, text='Shape:')
shd_lbl = ttk.Label(mf, text='Shading:')

enter_cn_lbl = ttk.Label(mf, text='Or enter card name:')

amt_cmb = ttk.Combobox(mf, values=('', '1', '2', '3'), state='disabled', textvariable=amt_val, width=8)
clr_cmb = ttk.Combobox(mf, values=('', 'red', 'green', 'purple'), state='disabled', textvariable=clr_val, width=8)
shp_cmb = ttk.Combobox(mf, values=('', 'oval', 'diamond', 'squiggle'), state='disabled', textvariable=shp_val, width=8)
shd_cmb = ttk.Combobox(mf, values=('', 'filled', 'half-filled', 'empty'), state='disabled', textvariable=shd_val, width=8)

amt_cmb.bind('<<ComboboxSelected>>', preview_card)
clr_cmb.bind('<<ComboboxSelected>>', preview_card)
shp_cmb.bind('<<ComboboxSelected>>', preview_card)
shd_cmb.bind('<<ComboboxSelected>>', preview_card)

txt_entr = ttk.Entry(mf, textvariable=txt_val, width=6, state='disabled', validate='key', validatecommand=validate_entry_wrapper)
root.bind("<space>", lambda x: entry_handler(True))
txt_val.trace_add("write", entry_handler)

err_lbl = ttk.Label(mf, textvariable=error_msg, foreground='red')

for i in range(12): exec(f"cd_btns.append(ttk.Button(mf, textvariable=cd_vals[i], image=blank_cd, compound='top', command=lambda: select_card({i})))")
for i in range(3): set_cd_lbls.append(ttk.Label(mf1, textvariable=set_cd_vals[i], image=blank_cd, compound='top'))

bck_btn = ttk.Button(mf1, text='Back', command=lambda: switch_set_view(-1), state='disabled')
nxt_btn = ttk.Button(mf1, text='Next', command=lambda: switch_set_view(1), state='disabled')
ext_btn = ttk.Button(mf1, text='Exit', command=lambda: sys.exit())
dne_btn = ttk.Button(mf, text='Done', command=finish_selection, state='disabled')
clear_btn = ttk.Button(mf, text='Clear All', command=clear_cards, state='disabled')
calc_btn = ttk.Button(mf, text='Calculate', command=solve_for_sets, state='disabled')

# tb1
pto_hlp_lbl = ttk.Label(mf2, text='This uses photo-recognition technology to scan a photo for set cards.'
                        ' In order to use this techn-\nology efficiently, take a well-lit photo where all card values are easily visible.', justify=CENTER)
i_pto_btn = ttk.Button(mf2, text='Import Image', command=get_photo)
pto_lbl = ttk.Label(mf2)
cds_found_lbl = ttk.Label(mf2, textvariable=cds_found_val)
i_cds_btn = ttk.Button(mf2, text='Import Cards', state='disabled', command=merge_cards)

# Grid widgets
tab_manager.grid(row=0, column=0)

# tb1
mf.grid(row=0, column=0)
mf1.grid(row=1, column=0)

cnbr_lbl.grid(row=0, column=0, columnspan=3)
card_lbl.grid(row=0, column=4)
sets_lbl.grid(row=0, column=0, columnspan=3)

amt_lbl.grid(row=1, column=0)
clr_lbl.grid(row=2, column=0)
shp_lbl.grid(row=3, column=0)
shd_lbl.grid(row=4, column=0)
enter_cn_lbl.grid(row=5, column=0, columnspan=2)

amt_cmb.grid(row=1, column=1, columnspan=2)
clr_cmb.grid(row=2, column=1, columnspan=2)
shp_cmb.grid(row=3, column=1, columnspan=2)
shd_cmb.grid(row=4, column=1, columnspan=2)

txt_entr.grid(row=5, column=2)
err_lbl.grid(row=5, column=4)

for i, j in zip(cd_btns, range(12)):
    i.grid(row=(j//3 + 1), column=(j%3 + 3))

for i, j in zip(set_cd_lbls, range(3)):
    i.grid(row=1, column=j)

bck_btn.grid(row=2, column=0)
nxt_btn.grid(row=2, column=1)
ext_btn.grid(row=2, column=2)
dne_btn.grid(row=5, column=3)
clear_btn.grid(row=0, column=5)
calc_btn.grid(row=5, column=5)

for child in mf.winfo_children(): 
    child.grid_configure(padx=5, pady=5)

for child in mf1.winfo_children(): 
    child.grid_configure(padx=5, pady=5)

# tb2
mf2.grid(row=0, column=0)

pto_hlp_lbl.grid(row=0, column=0, columnspan=2)
i_pto_btn.grid(row=1, column=0)
i_cds_btn.grid(row=1, column=1)
pto_lbl.grid(row=2, column=0, columnspan=2)
cds_found_lbl.grid(row=3, column=0)

for child in mf2.winfo_children(): 
    child.grid_configure(padx=5, pady=5)


root.mainloop()