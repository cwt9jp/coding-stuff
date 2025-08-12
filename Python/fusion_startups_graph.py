from matplotlib import pyplot as plt
from matplotlib import colormaps as cmaps
import matplotlib as mpl

data = '''
    1955
    1985
    1998
    2002
    2003
    2005
    2006
    2008
    2009
    2009
    2010
    2011
    2013
    2014
    2017
    2017
    2017
    2017
    2018
    2018
    2019
    2019
    2019
    2019
    2019
    2019
    2020
    2020
    2021
    2021
    2021
    2021
    2021
    2021
    2021
    2021
    2022
    2022
    2022
    2022
    2022
    2022
    2022
    2022
    2022
    2022
    2023
    2023
    2023
    2023
    2023
    2023
    2023
    2024
    2024
    '''.split()

for i in range(len(data)):
    data[i] = int(data[i])

bin_values, bins, myart = plt.hist(data, bins=range(1955, 2030, 5), edgecolor='white', linewidth=2)
centers = 0.5 * (bins[:-1] + bins[1:])
centers = (centers - min(centers)) / (max(centers) - min(centers) + 10) # normalize the centers to be between 0 and 1

for c, p in zip(centers, myart):
    plt.setp(p, 'facecolor', mpl.colormaps['inferno'](c)) # change each bin artist's color to whatever color the colormap is at 'c'

plt.xticks(range(1955, 2030, 5), rotation=90)
plt.title('Fusion Startups Founded by Year')
plt.xlabel('Year')
plt.ylabel('Number of Startups')

plt.savefig('fusion_startups_graph.png', bbox_inches='tight', dpi=300)