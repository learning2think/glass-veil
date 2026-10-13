window.ATLAS_CATALOG = {
  rdkit: '2025.09.6',
  source: 'bbb/data/substances.py',
  molecules: [
    {
      id: 'caffeine',
      name: 'Кофеин',
      english: 'Caffeine',
      cid: 2519,
      topic: 'Компактная структура',
      note: 'Два карбонила и несколько атомов азота: найдите их на структуре и сопоставьте с TPSA и HBA.',
      smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
      canonical: 'Cn1c(=O)c2c(ncn2C)n(C)c1=O',
      formula: 'C8H10N4O2',
      mw: 194.19,
      logp: -1.03,
      tpsa: 61.82,
      hbd: 0,
      hba: 3,
      rotatable: 0,
      rings: 2,
      model3d: {
        method: 'RDKit ETKDGv3 + UFF; heavy atoms',
        atoms: [
          {
            element: 'C',
            position: [3.1814, -1.233, -0.0309],
          },
          {
            element: 'N',
            position: [2.2105, -0.1438, -0.0023],
          },
          {
            element: 'C',
            position: [2.4749, 1.1859, -0.0146],
          },
          {
            element: 'N',
            position: [1.3542, 1.9538, 0.0006],
          },
          {
            element: 'C',
            position: [0.3641, 1.0386, 0.0256],
          },
          {
            element: 'C',
            position: [0.8693, -0.2159, 0.0211],
          },
          {
            element: 'C',
            position: [0.0223, -1.3164, 0.017],
          },
          {
            element: 'O',
            position: [0.4929, -2.4867, -0.0083],
          },
          {
            element: 'N',
            position: [-1.3359, -1.0924, 0.0318],
          },
          {
            element: 'C',
            position: [-1.8293, 0.2023, 0.006],
          },
          {
            element: 'O',
            position: [-3.0768, 0.3971, -0.0482],
          },
          {
            element: 'N',
            position: [-0.9744, 1.2836, 0.0313],
          },
          {
            element: 'C',
            position: [-1.4865, 2.6594, -0.0194],
          },
          {
            element: 'C',
            position: [-2.2667, -2.2326, -0.0097],
          },
        ],
        bonds: [
          {
            a: 0,
            b: 1,
            order: 1.0,
          },
          {
            a: 1,
            b: 2,
            order: 1.5,
          },
          {
            a: 2,
            b: 3,
            order: 1.5,
          },
          {
            a: 3,
            b: 4,
            order: 1.5,
          },
          {
            a: 4,
            b: 5,
            order: 1.5,
          },
          {
            a: 5,
            b: 6,
            order: 1.5,
          },
          {
            a: 6,
            b: 7,
            order: 2.0,
          },
          {
            a: 6,
            b: 8,
            order: 1.5,
          },
          {
            a: 8,
            b: 9,
            order: 1.5,
          },
          {
            a: 9,
            b: 10,
            order: 2.0,
          },
          {
            a: 9,
            b: 11,
            order: 1.5,
          },
          {
            a: 11,
            b: 12,
            order: 1.0,
          },
          {
            a: 8,
            b: 13,
            order: 1.0,
          },
          {
            a: 5,
            b: 1,
            order: 1.5,
          },
          {
            a: 11,
            b: 4,
            order: 1.5,
          },
        ],
      },
    },
    {
      id: 'diazepam',
      name: 'Диазепам',
      english: 'Diazepam',
      cid: 3016,
      topic: 'Липофильный каркас',
      note: 'Сравните ароматические кольца с кофеином. Более высокий расчётный logP сам по себе не доказывает проникновение через ГЭБ.',
      smiles: 'CN1C(=O)CN=C(c2ccccc2)c2cc(Cl)ccc21',
      canonical: 'CN1C(=O)CN=C(c2ccccc2)c2cc(Cl)ccc21',
      formula: 'C16H13ClN2O',
      mw: 284.75,
      logp: 3.15,
      tpsa: 32.67,
      hbd: 0,
      hba: 2,
      rotatable: 1,
      rings: 3,
      model3d: {
        method: 'RDKit ETKDGv3 + UFF; heavy atoms',
        atoms: [
          {
            element: 'C',
            position: [2.9255, 1.2929, 1.9406],
          },
          {
            element: 'N',
            position: [2.2099, 1.0849, 0.678],
          },
          {
            element: 'C',
            position: [2.1053, 2.1741, -0.2593],
          },
          {
            element: 'O',
            position: [2.7507, 3.2411, -0.0688],
          },
          {
            element: 'C',
            position: [1.2209, 2.0622, -1.4605],
          },
          {
            element: 'N',
            position: [-0.132, 1.7313, -1.0304],
          },
          {
            element: 'C',
            position: [-0.4845, 0.6097, -0.4678],
          },
          {
            element: 'C',
            position: [-1.908, 0.43, -0.0783],
          },
          {
            element: 'C',
            position: [-2.9285, 1.1058, -0.7747],
          },
          {
            element: 'C',
            position: [-4.2669, 0.9446, -0.4035],
          },
          {
            element: 'C',
            position: [-4.6019, 0.1153, 0.6689],
          },
          {
            element: 'C',
            position: [-3.5989, -0.5521, 1.3749],
          },
          {
            element: 'C',
            position: [-2.259, -0.3949, 1.0082],
          },
          {
            element: 'C',
            position: [0.5031, -0.4872, -0.2486],
          },
          {
            element: 'C',
            position: [0.1432, -1.8014, -0.6006],
          },
          {
            element: 'C',
            position: [1.0274, -2.8628, -0.398],
          },
          {
            element: 'Cl',
            position: [0.5567, -4.4937, -0.8404],
          },
          {
            element: 'C',
            position: [2.2857, -2.6256, 0.1536],
          },
          {
            element: 'C',
            position: [2.664, -1.3286, 0.5012],
          },
          {
            element: 'C',
            position: [1.7872, -0.2454, 0.3054],
          },
        ],
        bonds: [
          {
            a: 0,
            b: 1,
            order: 1.0,
          },
          {
            a: 1,
            b: 2,
            order: 1.0,
          },
          {
            a: 2,
            b: 3,
            order: 2.0,
          },
          {
            a: 2,
            b: 4,
            order: 1.0,
          },
          {
            a: 4,
            b: 5,
            order: 1.0,
          },
          {
            a: 5,
            b: 6,
            order: 2.0,
          },
          {
            a: 6,
            b: 7,
            order: 1.0,
          },
          {
            a: 7,
            b: 8,
            order: 1.5,
          },
          {
            a: 8,
            b: 9,
            order: 1.5,
          },
          {
            a: 9,
            b: 10,
            order: 1.5,
          },
          {
            a: 10,
            b: 11,
            order: 1.5,
          },
          {
            a: 11,
            b: 12,
            order: 1.5,
          },
          {
            a: 6,
            b: 13,
            order: 1.0,
          },
          {
            a: 13,
            b: 14,
            order: 1.5,
          },
          {
            a: 14,
            b: 15,
            order: 1.5,
          },
          {
            a: 15,
            b: 16,
            order: 1.0,
          },
          {
            a: 15,
            b: 17,
            order: 1.5,
          },
          {
            a: 17,
            b: 18,
            order: 1.5,
          },
          {
            a: 18,
            b: 19,
            order: 1.5,
          },
          {
            a: 19,
            b: 1,
            order: 1.0,
          },
          {
            a: 12,
            b: 7,
            order: 1.5,
          },
          {
            a: 19,
            b: 13,
            order: 1.5,
          },
        ],
      },
    },
    {
      id: 'aspirin',
      name: 'Аспирин',
      english: 'Aspirin',
      cid: 2244,
      topic: 'Ионизируемая группа',
      note: 'Карбоксильная группа делает важным учёт pH и ионизации. logP нейтральной структуры не заменяет logD при заданном pH.',
      smiles: 'CC(=O)Oc1ccccc1C(=O)O',
      canonical: 'CC(=O)Oc1ccccc1C(=O)O',
      formula: 'C9H8O4',
      mw: 180.16,
      logp: 1.31,
      tpsa: 63.6,
      hbd: 1,
      hba: 3,
      rotatable: 2,
      rings: 1,
      model3d: {
        method: 'RDKit ETKDGv3 + UFF; heavy atoms',
        atoms: [
          {
            element: 'C',
            position: [-3.7321, 0.8772, 0.3713],
          },
          {
            element: 'C',
            position: [-2.5691, 0.0585, -0.0751],
          },
          {
            element: 'O',
            position: [-2.7518, -0.8878, -0.888],
          },
          {
            element: 'O',
            position: [-1.279, 0.424, 0.3306],
          },
          {
            element: 'C',
            position: [-0.1283, -0.3696, 0.193],
          },
          {
            element: 'C',
            position: [-0.2069, -1.7742, 0.2702],
          },
          {
            element: 'C',
            position: [0.9406, -2.5578, 0.1468],
          },
          {
            element: 'C',
            position: [2.1811, -1.9537, -0.0438],
          },
          {
            element: 'C',
            position: [2.2812, -0.5629, -0.1032],
          },
          {
            element: 'C',
            position: [1.1361, 0.2476, 0.0193],
          },
          {
            element: 'C',
            position: [1.2888, 1.7245, -0.0485],
          },
          {
            element: 'O',
            position: [0.2871, 2.4852, 0.0326],
          },
          {
            element: 'O',
            position: [2.5524, 2.2891, -0.205],
          },
        ],
        bonds: [
          {
            a: 0,
            b: 1,
            order: 1.0,
          },
          {
            a: 1,
            b: 2,
            order: 2.0,
          },
          {
            a: 1,
            b: 3,
            order: 1.0,
          },
          {
            a: 3,
            b: 4,
            order: 1.0,
          },
          {
            a: 4,
            b: 5,
            order: 1.5,
          },
          {
            a: 5,
            b: 6,
            order: 1.5,
          },
          {
            a: 6,
            b: 7,
            order: 1.5,
          },
          {
            a: 7,
            b: 8,
            order: 1.5,
          },
          {
            a: 8,
            b: 9,
            order: 1.5,
          },
          {
            a: 9,
            b: 10,
            order: 1.0,
          },
          {
            a: 10,
            b: 11,
            order: 2.0,
          },
          {
            a: 10,
            b: 12,
            order: 1.0,
          },
          {
            a: 9,
            b: 4,
            order: 1.5,
          },
        ],
      },
    },
    {
      id: 'atenolol',
      name: 'Атенолол',
      english: 'Atenolol',
      cid: 2249,
      topic: 'Полярные группы',
      note: 'Сопоставьте гидроксильную, амидную и аминную группы с числом доноров и акцепторов водородных связей.',
      smiles: 'CC(C)NCC(O)COc1ccc(CC(N)=O)cc1',
      canonical: 'CC(C)NCC(O)COc1ccc(CC(N)=O)cc1',
      formula: 'C14H22N2O3',
      mw: 266.34,
      logp: 0.45,
      tpsa: 84.58,
      hbd: 3,
      hba: 4,
      rotatable: 8,
      rings: 1,
      model3d: {
        method: 'RDKit ETKDGv3 + UFF; heavy atoms',
        atoms: [
          {
            element: 'C',
            position: [7.273, 0.7662, -0.1918],
          },
          {
            element: 'C',
            position: [5.9003, 0.2445, 0.2514],
          },
          {
            element: 'C',
            position: [6.0677, -0.6204, 1.5113],
          },
          {
            element: 'N',
            position: [5.2921, -0.5183, -0.8588],
          },
          {
            element: 'C',
            position: [3.9392, -1.0449, -0.593],
          },
          {
            element: 'C',
            position: [2.8868, 0.0528, -0.3057],
          },
          {
            element: 'O',
            position: [2.9029, 1.0469, -1.3001],
          },
          {
            element: 'C',
            position: [1.4835, -0.5551, -0.1795],
          },
          {
            element: 'O',
            position: [0.544, 0.4716, 0.1306],
          },
          {
            element: 'C',
            position: [-0.8296, 0.2593, 0.3186],
          },
          {
            element: 'C',
            position: [-1.4181, -1.0158, 0.2167],
          },
          {
            element: 'C',
            position: [-2.7932, -1.175, 0.4133],
          },
          {
            element: 'C',
            position: [-3.5985, -0.0682, 0.7231],
          },
          {
            element: 'C',
            position: [-5.0821, -0.2365, 0.9016],
          },
          {
            element: 'C',
            position: [-5.7755, -0.135, -0.4223],
          },
          {
            element: 'N',
            position: [-6.1253, 1.1406, -0.959],
          },
          {
            element: 'O',
            position: [-6.0166, -1.1791, -1.085],
          },
          {
            element: 'C',
            position: [-3.0127, 1.2039, 0.8127],
          },
          {
            element: 'C',
            position: [-1.638, 1.3624, 0.616],
          },
        ],
        bonds: [
          {
            a: 0,
            b: 1,
            order: 1.0,
          },
          {
            a: 1,
            b: 2,
            order: 1.0,
          },
          {
            a: 1,
            b: 3,
            order: 1.0,
          },
          {
            a: 3,
            b: 4,
            order: 1.0,
          },
          {
            a: 4,
            b: 5,
            order: 1.0,
          },
          {
            a: 5,
            b: 6,
            order: 1.0,
          },
          {
            a: 5,
            b: 7,
            order: 1.0,
          },
          {
            a: 7,
            b: 8,
            order: 1.0,
          },
          {
            a: 8,
            b: 9,
            order: 1.0,
          },
          {
            a: 9,
            b: 10,
            order: 1.5,
          },
          {
            a: 10,
            b: 11,
            order: 1.5,
          },
          {
            a: 11,
            b: 12,
            order: 1.5,
          },
          {
            a: 12,
            b: 13,
            order: 1.0,
          },
          {
            a: 13,
            b: 14,
            order: 1.0,
          },
          {
            a: 14,
            b: 15,
            order: 1.0,
          },
          {
            a: 14,
            b: 16,
            order: 2.0,
          },
          {
            a: 12,
            b: 17,
            order: 1.5,
          },
          {
            a: 17,
            b: 18,
            order: 1.5,
          },
          {
            a: 18,
            b: 9,
            order: 1.5,
          },
        ],
      },
    },
    {
      id: 'levetiracetam',
      name: 'Леветирацетам',
      english: 'Levetiracetam',
      cid: 5284583,
      topic: 'Полярность и размер',
      note: 'Небольшая молекулярная масса может сочетаться с полярными группами. Сравните этот профиль с кофеином.',
      smiles: 'CC[C@@H](C(N)=O)N1CCCC1=O',
      canonical: 'CC[C@@H](C(N)=O)N1CCCC1=O',
      formula: 'C8H14N2O2',
      mw: 170.21,
      logp: -0.13,
      tpsa: 63.4,
      hbd: 1,
      hba: 2,
      rotatable: 3,
      rings: 1,
      model3d: {
        method: 'RDKit ETKDGv3 + UFF; heavy atoms',
        atoms: [
          {
            element: 'C',
            position: [-0.8252, -1.9751, 1.4524],
          },
          {
            element: 'C',
            position: [-1.0873, -1.8179, -0.0487],
          },
          {
            element: 'C',
            position: [-0.8405, -0.389, -0.5899],
          },
          {
            element: 'C',
            position: [-1.9782, 0.5668, -0.3032],
          },
          {
            element: 'N',
            position: [-2.1677, 1.7121, -1.1343],
          },
          {
            element: 'O',
            position: [-2.74, 0.3905, 0.6851],
          },
          {
            element: 'N',
            position: [0.4473, 0.1468, -0.1216],
          },
          {
            element: 'C',
            position: [0.6333, 1.1644, 0.9035],
          },
          {
            element: 'C',
            position: [2.1526, 1.2627, 1.142],
          },
          {
            element: 'C',
            position: [2.8403, 0.3793, 0.0907],
          },
          {
            element: 'C',
            position: [1.7118, -0.2884, -0.5849],
          },
          {
            element: 'O',
            position: [1.8537, -1.1522, -1.491],
          },
        ],
        bonds: [
          {
            a: 0,
            b: 1,
            order: 1.0,
          },
          {
            a: 1,
            b: 2,
            order: 1.0,
          },
          {
            a: 2,
            b: 3,
            order: 1.0,
          },
          {
            a: 3,
            b: 4,
            order: 1.0,
          },
          {
            a: 3,
            b: 5,
            order: 2.0,
          },
          {
            a: 2,
            b: 6,
            order: 1.0,
          },
          {
            a: 6,
            b: 7,
            order: 1.0,
          },
          {
            a: 7,
            b: 8,
            order: 1.0,
          },
          {
            a: 8,
            b: 9,
            order: 1.0,
          },
          {
            a: 9,
            b: 10,
            order: 1.0,
          },
          {
            a: 10,
            b: 11,
            order: 2.0,
          },
          {
            a: 10,
            b: 6,
            order: 1.0,
          },
        ],
      },
    },
    {
      id: 'morphine',
      name: 'Морфин',
      english: 'Morphine',
      cid: 5288826,
      topic: 'Сложный кольцевой каркас',
      note: 'Посмотрите, как гидроксильные группы и кольцевая система сочетают полярность с жёсткой пространственной структурой.',
      smiles: 'CN1CC[C@]23c4c5ccc(O)c4O[C@H]2[C@@H](O)C=C[C@@H]3[C@@H]1C5',
      canonical: 'CN1CC[C@]23c4c5ccc(O)c4O[C@H]2[C@@H](O)C=C[C@@H]3[C@@H]1C5',
      formula: 'C17H19NO3',
      mw: 285.34,
      logp: 1.2,
      tpsa: 52.93,
      hbd: 2,
      hba: 4,
      rotatable: 0,
      rings: 5,
      model3d: {
        method: 'RDKit 2D coordinates; no converged 3D conformer',
        atoms: [
          {
            element: 'C',
            position: [-1.1643, -4.0926, 0.0],
          },
          {
            element: 'N',
            position: [-0.2055, -2.1126, 0.0],
          },
          {
            element: 'C',
            position: [-0.6547, -1.4506, 0.0],
          },
          {
            element: 'C',
            position: [-0.306, -0.7306, 0.0],
          },
          {
            element: 'C',
            position: [0.797, -0.0425, 0.0],
          },
          {
            element: 'C',
            position: [-0.689, 0.162, 0.0],
          },
          {
            element: 'C',
            position: [-1.8354, -0.8054, 0.0],
          },
          {
            element: 'C',
            position: [-3.2463, -0.2963, 0.0],
          },
          {
            element: 'C',
            position: [-3.511, 1.1802, 0.0],
          },
          {
            element: 'C',
            position: [-2.3646, 2.1476, 0.0],
          },
          {
            element: 'O',
            position: [-2.6293, 3.624, 0.0],
          },
          {
            element: 'C',
            position: [-0.9537, 1.6385, 0.0],
          },
          {
            element: 'O',
            position: [0.3688, 2.3465, 0.0],
          },
          {
            element: 'C',
            position: [1.4507, 1.3075, 0.0],
          },
          {
            element: 'C',
            position: [2.9468, 1.4164, 0.0],
          },
          {
            element: 'O',
            position: [3.6005, 2.7664, 0.0],
          },
          {
            element: 'C',
            position: [3.7891, 0.1752, 0.0],
          },
          {
            element: 'C',
            position: [3.1353, -1.1749, 0.0],
          },
          {
            element: 'C',
            position: [1.6393, -1.2837, 0.0],
          },
          {
            element: 'C',
            position: [0.9855, -2.6338, 0.0],
          },
          {
            element: 'C',
            position: [-1.1532, -2.1413, 0.0],
          },
        ],
        bonds: [
          {
            a: 0,
            b: 1,
            order: 1.0,
          },
          {
            a: 1,
            b: 2,
            order: 1.0,
          },
          {
            a: 2,
            b: 3,
            order: 1.0,
          },
          {
            a: 3,
            b: 4,
            order: 1.0,
          },
          {
            a: 4,
            b: 5,
            order: 1.0,
          },
          {
            a: 5,
            b: 6,
            order: 1.5,
          },
          {
            a: 6,
            b: 7,
            order: 1.5,
          },
          {
            a: 7,
            b: 8,
            order: 1.5,
          },
          {
            a: 8,
            b: 9,
            order: 1.5,
          },
          {
            a: 9,
            b: 10,
            order: 1.0,
          },
          {
            a: 9,
            b: 11,
            order: 1.5,
          },
          {
            a: 11,
            b: 12,
            order: 1.0,
          },
          {
            a: 12,
            b: 13,
            order: 1.0,
          },
          {
            a: 13,
            b: 14,
            order: 1.0,
          },
          {
            a: 14,
            b: 15,
            order: 1.0,
          },
          {
            a: 14,
            b: 16,
            order: 1.0,
          },
          {
            a: 16,
            b: 17,
            order: 2.0,
          },
          {
            a: 17,
            b: 18,
            order: 1.0,
          },
          {
            a: 18,
            b: 19,
            order: 1.0,
          },
          {
            a: 19,
            b: 20,
            order: 1.0,
          },
          {
            a: 19,
            b: 1,
            order: 1.0,
          },
          {
            a: 13,
            b: 4,
            order: 1.0,
          },
          {
            a: 18,
            b: 4,
            order: 1.0,
          },
          {
            a: 11,
            b: 5,
            order: 1.5,
          },
          {
            a: 20,
            b: 6,
            order: 1.0,
          },
        ],
      },
    },
    {
      id: 'gabapentin',
      name: 'Габапентин',
      english: 'Gabapentin',
      cid: 3446,
      topic: 'Заряд имеет значение',
      note: 'Аминная и карбоксильная группы требуют учёта микросостояний. Одна нейтрально записанная структура не описывает распределение зарядов в растворе.',
      smiles: 'NCC1(CC(=O)O)CCCCC1',
      canonical: 'NCC1(CC(=O)O)CCCCC1',
      formula: 'C9H17NO2',
      mw: 171.24,
      logp: 1.37,
      tpsa: 63.32,
      hbd: 2,
      hba: 2,
      rotatable: 3,
      rings: 1,
      model3d: {
        method: 'RDKit ETKDGv3 + UFF; heavy atoms',
        atoms: [
          {
            element: 'N',
            position: [3.1203, -1.062, -0.3857],
          },
          {
            element: 'C',
            position: [2.3678, -0.2549, 0.5799],
          },
          {
            element: 'C',
            position: [0.8596, -0.0194, 0.2055],
          },
          {
            element: 'C',
            position: [0.1916, -1.4285, 0.0368],
          },
          {
            element: 'C',
            position: [-1.3046, -1.4627, -0.0462],
          },
          {
            element: 'O',
            position: [-1.9926, -1.5601, 1.0054],
          },
          {
            element: 'O',
            position: [-1.9339, -1.4593, -1.2869],
          },
          {
            element: 'C',
            position: [0.8045, 0.8152, -1.1197],
          },
          {
            element: 'C',
            position: [-0.4939, 1.5992, -1.3468],
          },
          {
            element: 'C',
            position: [-0.8337, 2.4646, -0.1399],
          },
          {
            element: 'C',
            position: [-1.027, 1.5881, 1.0908],
          },
          {
            element: 'C',
            position: [0.242, 0.7798, 1.4068],
          },
        ],
        bonds: [
          {
            a: 0,
            b: 1,
            order: 1.0,
          },
          {
            a: 1,
            b: 2,
            order: 1.0,
          },
          {
            a: 2,
            b: 3,
            order: 1.0,
          },
          {
            a: 3,
            b: 4,
            order: 1.0,
          },
          {
            a: 4,
            b: 5,
            order: 2.0,
          },
          {
            a: 4,
            b: 6,
            order: 1.0,
          },
          {
            a: 2,
            b: 7,
            order: 1.0,
          },
          {
            a: 7,
            b: 8,
            order: 1.0,
          },
          {
            a: 8,
            b: 9,
            order: 1.0,
          },
          {
            a: 9,
            b: 10,
            order: 1.0,
          },
          {
            a: 10,
            b: 11,
            order: 1.0,
          },
          {
            a: 11,
            b: 2,
            order: 1.0,
          },
        ],
      },
    },
    {
      id: 'carbamazepine',
      name: 'Карбамазепин',
      english: 'Carbamazepine',
      cid: 2554,
      topic: 'Ароматический каркас',
      note: 'Сравните полярную амидную группу и крупный ароматический каркас с диазепамом: похожий размер не означает одинаковые свойства.',
      smiles: 'NC(=O)N1c2ccccc2C=Cc2ccccc21',
      canonical: 'NC(=O)N1c2ccccc2C=Cc2ccccc21',
      formula: 'C15H12N2O',
      mw: 236.27,
      logp: 3.39,
      tpsa: 46.33,
      hbd: 1,
      hba: 1,
      rotatable: 0,
      rings: 3,
      model3d: {
        method: 'RDKit ETKDGv3 + UFF; heavy atoms',
        atoms: [
          {
            element: 'N',
            position: [-1.2143, -2.8203, -1.1206],
          },
          {
            element: 'C',
            position: [-0.0072, -2.2167, -0.6462],
          },
          {
            element: 'O',
            position: [1.0688, -2.8696, -0.7218],
          },
          {
            element: 'N',
            position: [-0.0013, -0.8693, -0.1263],
          },
          {
            element: 'C',
            position: [1.2309, -0.197, 0.162],
          },
          {
            element: 'C',
            position: [2.1233, -0.7494, 1.0961],
          },
          {
            element: 'C',
            position: [3.3356, -0.1167, 1.3753],
          },
          {
            element: 'C',
            position: [3.6686, 1.0704, 0.7234],
          },
          {
            element: 'C',
            position: [2.7855, 1.6321, -0.2017],
          },
          {
            element: 'C',
            position: [1.5507, 1.0195, -0.4764],
          },
          {
            element: 'C',
            position: [0.6739, 1.6392, -1.497],
          },
          {
            element: 'C',
            position: [-0.6674, 1.649, -1.4846],
          },
          {
            element: 'C',
            position: [-1.534, 1.04, -0.4493],
          },
          {
            element: 'C',
            position: [-2.7568, 1.6665, -0.1528],
          },
          {
            element: 'C',
            position: [-3.6315, 1.1123, 0.7849],
          },
          {
            element: 'C',
            position: [-3.3028, -0.0814, 1.4272],
          },
          {
            element: 'C',
            position: [-2.1027, -0.7272, 1.1268],
          },
          {
            element: 'C',
            position: [-1.219, -0.1815, 0.1811],
          },
        ],
        bonds: [
          {
            a: 0,
            b: 1,
            order: 1.0,
          },
          {
            a: 1,
            b: 2,
            order: 2.0,
          },
          {
            a: 1,
            b: 3,
            order: 1.0,
          },
          {
            a: 3,
            b: 4,
            order: 1.0,
          },
          {
            a: 4,
            b: 5,
            order: 1.5,
          },
          {
            a: 5,
            b: 6,
            order: 1.5,
          },
          {
            a: 6,
            b: 7,
            order: 1.5,
          },
          {
            a: 7,
            b: 8,
            order: 1.5,
          },
          {
            a: 8,
            b: 9,
            order: 1.5,
          },
          {
            a: 9,
            b: 10,
            order: 1.0,
          },
          {
            a: 10,
            b: 11,
            order: 2.0,
          },
          {
            a: 11,
            b: 12,
            order: 1.0,
          },
          {
            a: 12,
            b: 13,
            order: 1.5,
          },
          {
            a: 13,
            b: 14,
            order: 1.5,
          },
          {
            a: 14,
            b: 15,
            order: 1.5,
          },
          {
            a: 15,
            b: 16,
            order: 1.5,
          },
          {
            a: 16,
            b: 17,
            order: 1.5,
          },
          {
            a: 17,
            b: 3,
            order: 1.0,
          },
          {
            a: 9,
            b: 4,
            order: 1.5,
          },
          {
            a: 17,
            b: 12,
            order: 1.5,
          },
        ],
      },
    },
  ],
};
