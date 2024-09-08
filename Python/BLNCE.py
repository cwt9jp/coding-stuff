from sys import exit

while True:
  equation = input()
  if equation == 'q': break
  balanced_equation = ''
  reactants = [[1]]
  products = [[1]]
  b = True
  side = True

  def gcd(a, b):
      while b != 0:
          a, b = b, a % b
      return a

  def lcm(x, y):
    if x > 0 and y > 1: return x * y // gcd(x, y)
    elif y == 1: return 2 * x
    else: return float('inf')

  for i in equation:
    if i not in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-']:
      if b:
        reactants[-1].append(i) if side else products[-1].append(i)
        b = False
      elif side: reactants[-1][-1] += i
      else: products[-1][-1] += i
    elif i not in ['+', '-']:
      if b:
        if side: reactants[-1][-1] = 10 * reactants[-1][-1] + int(i)
        else: products[-1][-1] = 10 * products[-1][-1] + int(i)
      else:
        reactants[-1].append(int(i)) if side else products[-1].append(int(i))
        b = True
    elif i == '+':
      reactants.append([1]) if side else products.append([1])
      b = True
    else: side = False

  for z in range(10):
    all_eq = True
    react_dict = {}
    prod_dict = {}
    react_ele_list = []
    prod_ele_list = []

    for j in reactants:
      coeff = j[0]
      for k in range(int(len(j[1:]) / 2)):
        try: react_dict[j[2 * k + 1]] += j[2 * k + 2] * coeff
        except KeyError: react_dict[j[2 * k + 1]] = j[2 * k + 2] * coeff
    for j in products:
      coeff = j[0]
      for k in range(int(len(j[1:]) / 2)):
        try: prod_dict[j[2 * k + 1]] += j[2 * k + 2] * coeff
        except KeyError: prod_dict[j[2 * k + 1]] = j[2 * k + 2] * coeff
    if len(react_dict) != len(prod_dict): exit('Equation cannot be balanced')
    else:
      # print(react_dict, prod_dict)
      for i in react_dict:
        if react_dict[i] != prod_dict[i]:
          # print('balancing', i)
          for j in reactants:
            if j.count(i): react_ele_list.append(j[j.index(i) + 1] * j[0])
          for j in products:
            if j.count(i): prod_ele_list.append(j[j.index(i) + 1] * j[0])
          # print(react_ele_list, prod_ele_list)
          if len(react_ele_list) == 1 and len(prod_ele_list) == 1:
            for j in reactants:
              if j.count(i): j[0] *= int(lcm(int(react_dict[i]), int(prod_dict[i])) / int(react_dict[i]))
            for j in products:
              if j.count(i): j[0] *= int(lcm(int(react_dict[i]), int(prod_dict[i])) / int(prod_dict[i]))
          else:
            most_eff = [lcm(react_dict[i], prod_dict[i]), 'sum', None]
            for j in range(len(react_ele_list)):
              contender = lcm(react_ele_list[j], prod_dict[i] - react_dict[i] + react_ele_list[j])
              if contender < most_eff[0]:
                most_eff = [contender, j, 'r']
            for j in range(len(prod_ele_list)):
              contender = lcm(prod_ele_list[j], react_dict[i] - prod_dict[i] + prod_ele_list[j])
              if contender < most_eff[0]:
                most_eff = [contender, j, 'p']
            # print('Most Eff:', most_eff)
            if most_eff[2] == 'r':
              count = -1
              for j in reactants:
                if j.count(i):
                  count += 1
                  if count == most_eff[1]:
                    sum_ = j[0] * j[j.index(i) + 1]
                    j[0] *= int(most_eff[0] / sum_)
                    adj = j[0] * j[j.index(i) + 1] - sum_
                    break
              for j in products:
                if j.count(i): j[0] *= int((react_dict[i] + adj) / prod_dict[i])
            elif most_eff[2] == 'p':
              count = -1
              for j in products:
                if j.count(i):
                  count += 1
                  if count == most_eff[1]:
                    sum_ = j[0] * j[j.index(i) + 1]
                    j[0] *= int(most_eff[0] / sum_)
                    adj = j[0] * j[j.index(i) + 1] - sum_
                    break
              for j in reactants:
                if j.count(i): j[0] *= int((prod_dict[i] + adj) / react_dict[i])
            else:
              for j in reactants:
                if j.count(i): j[0] *= int(lcm(int(react_dict[i]), int(prod_dict[i])) / int(react_dict[i]))
              for j in products:
                if j.count(i): j[0] *= int(lcm(int(react_dict[i]), int(prod_dict[i])) / int(prod_dict[i]))
          all_eq = False
          # print('after balance:', reactants, products)
          break
      if all_eq:
        for i in reactants:
          for j in i: balanced_equation += str(j)
          balanced_equation += '+'
        balanced_equation = balanced_equation[:-1]
        balanced_equation += '->'
        for i in products:
          for j in i: balanced_equation += str(j)
          balanced_equation += '+'
        balanced_equation = balanced_equation[:-1]
        print('Balanced equation:', balanced_equation)
        exit()