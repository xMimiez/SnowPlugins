var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.bun/color-name@1.1.4/node_modules/color-name/index.js
var require_color_name = __commonJS({
  "node_modules/.bun/color-name@1.1.4/node_modules/color-name/index.js"(exports, module) {
    "use strict";
    module.exports = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
    };
  }
});

// node_modules/.bun/spdx-license-ids@3.0.23/node_modules/spdx-license-ids/index.json
var require_spdx_license_ids = __commonJS({
  "node_modules/.bun/spdx-license-ids@3.0.23/node_modules/spdx-license-ids/index.json"(exports, module) {
    module.exports = [
      "0BSD",
      "3D-Slicer-1.0",
      "AAL",
      "ADSL",
      "AFL-1.1",
      "AFL-1.2",
      "AFL-2.0",
      "AFL-2.1",
      "AFL-3.0",
      "AGPL-1.0-only",
      "AGPL-1.0-or-later",
      "AGPL-3.0-only",
      "AGPL-3.0-or-later",
      "ALGLIB-Documentation",
      "AMD-newlib",
      "AMDPLPA",
      "AML",
      "AML-glslang",
      "AMPAS",
      "ANTLR-PD",
      "ANTLR-PD-fallback",
      "APAFML",
      "APL-1.0",
      "APSL-1.0",
      "APSL-1.1",
      "APSL-1.2",
      "APSL-2.0",
      "ASWF-Digital-Assets-1.0",
      "ASWF-Digital-Assets-1.1",
      "Abstyles",
      "AdaCore-doc",
      "Adobe-2006",
      "Adobe-Display-PostScript",
      "Adobe-Glyph",
      "Adobe-Utopia",
      "Advanced-Cryptics-Dictionary",
      "Afmparse",
      "Aladdin",
      "Apache-1.0",
      "Apache-1.1",
      "Apache-2.0",
      "App-s2p",
      "Arphic-1999",
      "Artistic-1.0",
      "Artistic-1.0-Perl",
      "Artistic-1.0-cl8",
      "Artistic-2.0",
      "Artistic-dist",
      "Aspell-RU",
      "BOLA-1.1",
      "BSD-1-Clause",
      "BSD-2-Clause",
      "BSD-2-Clause-Darwin",
      "BSD-2-Clause-Patent",
      "BSD-2-Clause-Views",
      "BSD-2-Clause-first-lines",
      "BSD-2-Clause-pkgconf-disclaimer",
      "BSD-3-Clause",
      "BSD-3-Clause-Attribution",
      "BSD-3-Clause-Clear",
      "BSD-3-Clause-HP",
      "BSD-3-Clause-LBNL",
      "BSD-3-Clause-Modification",
      "BSD-3-Clause-No-Military-License",
      "BSD-3-Clause-No-Nuclear-License",
      "BSD-3-Clause-No-Nuclear-License-2014",
      "BSD-3-Clause-No-Nuclear-Warranty",
      "BSD-3-Clause-Open-MPI",
      "BSD-3-Clause-Sun",
      "BSD-3-Clause-Tso",
      "BSD-3-Clause-acpica",
      "BSD-3-Clause-flex",
      "BSD-4-Clause",
      "BSD-4-Clause-Shortened",
      "BSD-4-Clause-UC",
      "BSD-4.3RENO",
      "BSD-4.3TAHOE",
      "BSD-Advertising-Acknowledgement",
      "BSD-Attribution-HPND-disclaimer",
      "BSD-Inferno-Nettverk",
      "BSD-Mark-Modifications",
      "BSD-Protection",
      "BSD-Source-Code",
      "BSD-Source-beginning-file",
      "BSD-Systemics",
      "BSD-Systemics-W3Works",
      "BSL-1.0",
      "BUSL-1.1",
      "Baekmuk",
      "Bahyph",
      "Barr",
      "Beerware",
      "BitTorrent-1.0",
      "BitTorrent-1.1",
      "Bitstream-Charter",
      "Bitstream-Vera",
      "BlueOak-1.0.0",
      "Boehm-GC",
      "Boehm-GC-without-fee",
      "Borceux",
      "Brian-Gladman-2-Clause",
      "Brian-Gladman-3-Clause",
      "Buddy",
      "C-UDA-1.0",
      "CAL-1.0",
      "CAL-1.0-Combined-Work-Exception",
      "CAPEC-tou",
      "CATOSL-1.1",
      "CC-BY-1.0",
      "CC-BY-2.0",
      "CC-BY-2.5",
      "CC-BY-2.5-AU",
      "CC-BY-3.0",
      "CC-BY-3.0-AT",
      "CC-BY-3.0-AU",
      "CC-BY-3.0-DE",
      "CC-BY-3.0-IGO",
      "CC-BY-3.0-NL",
      "CC-BY-3.0-US",
      "CC-BY-4.0",
      "CC-BY-NC-1.0",
      "CC-BY-NC-2.0",
      "CC-BY-NC-2.5",
      "CC-BY-NC-3.0",
      "CC-BY-NC-3.0-DE",
      "CC-BY-NC-4.0",
      "CC-BY-NC-ND-1.0",
      "CC-BY-NC-ND-2.0",
      "CC-BY-NC-ND-2.5",
      "CC-BY-NC-ND-3.0",
      "CC-BY-NC-ND-3.0-DE",
      "CC-BY-NC-ND-3.0-IGO",
      "CC-BY-NC-ND-4.0",
      "CC-BY-NC-SA-1.0",
      "CC-BY-NC-SA-2.0",
      "CC-BY-NC-SA-2.0-DE",
      "CC-BY-NC-SA-2.0-FR",
      "CC-BY-NC-SA-2.0-UK",
      "CC-BY-NC-SA-2.5",
      "CC-BY-NC-SA-3.0",
      "CC-BY-NC-SA-3.0-DE",
      "CC-BY-NC-SA-3.0-IGO",
      "CC-BY-NC-SA-4.0",
      "CC-BY-ND-1.0",
      "CC-BY-ND-2.0",
      "CC-BY-ND-2.5",
      "CC-BY-ND-3.0",
      "CC-BY-ND-3.0-DE",
      "CC-BY-ND-4.0",
      "CC-BY-SA-1.0",
      "CC-BY-SA-2.0",
      "CC-BY-SA-2.0-UK",
      "CC-BY-SA-2.1-JP",
      "CC-BY-SA-2.5",
      "CC-BY-SA-3.0",
      "CC-BY-SA-3.0-AT",
      "CC-BY-SA-3.0-DE",
      "CC-BY-SA-3.0-IGO",
      "CC-BY-SA-4.0",
      "CC-PDDC",
      "CC-PDM-1.0",
      "CC-SA-1.0",
      "CC0-1.0",
      "CDDL-1.0",
      "CDDL-1.1",
      "CDL-1.0",
      "CDLA-Permissive-1.0",
      "CDLA-Permissive-2.0",
      "CDLA-Sharing-1.0",
      "CECILL-1.0",
      "CECILL-1.1",
      "CECILL-2.0",
      "CECILL-2.1",
      "CECILL-B",
      "CECILL-C",
      "CERN-OHL-1.1",
      "CERN-OHL-1.2",
      "CERN-OHL-P-2.0",
      "CERN-OHL-S-2.0",
      "CERN-OHL-W-2.0",
      "CFITSIO",
      "CMU-Mach",
      "CMU-Mach-nodoc",
      "CNRI-Jython",
      "CNRI-Python",
      "CNRI-Python-GPL-Compatible",
      "COIL-1.0",
      "CPAL-1.0",
      "CPL-1.0",
      "CPOL-1.02",
      "CUA-OPL-1.0",
      "Caldera",
      "Caldera-no-preamble",
      "Catharon",
      "ClArtistic",
      "Clips",
      "Community-Spec-1.0",
      "Condor-1.1",
      "Cornell-Lossless-JPEG",
      "Cronyx",
      "Crossword",
      "CryptoSwift",
      "CrystalStacker",
      "Cube",
      "D-FSL-1.0",
      "DEC-3-Clause",
      "DL-DE-BY-2.0",
      "DL-DE-ZERO-2.0",
      "DOC",
      "DRL-1.0",
      "DRL-1.1",
      "DSDP",
      "DocBook-DTD",
      "DocBook-Schema",
      "DocBook-Stylesheet",
      "DocBook-XML",
      "Dotseqn",
      "ECL-1.0",
      "ECL-2.0",
      "EFL-1.0",
      "EFL-2.0",
      "EPICS",
      "EPL-1.0",
      "EPL-2.0",
      "ESA-PL-permissive-2.4",
      "ESA-PL-strong-copyleft-2.4",
      "ESA-PL-weak-copyleft-2.4",
      "EUDatagrid",
      "EUPL-1.0",
      "EUPL-1.1",
      "EUPL-1.2",
      "Elastic-2.0",
      "Entessa",
      "ErlPL-1.1",
      "Eurosym",
      "FBM",
      "FDK-AAC",
      "FSFAP",
      "FSFAP-no-warranty-disclaimer",
      "FSFUL",
      "FSFULLR",
      "FSFULLRSD",
      "FSFULLRWD",
      "FSL-1.1-ALv2",
      "FSL-1.1-MIT",
      "FTL",
      "Fair",
      "Ferguson-Twofish",
      "Frameworx-1.0",
      "FreeBSD-DOC",
      "FreeImage",
      "Furuseth",
      "GCR-docs",
      "GD",
      "GFDL-1.1-invariants-only",
      "GFDL-1.1-invariants-or-later",
      "GFDL-1.1-no-invariants-only",
      "GFDL-1.1-no-invariants-or-later",
      "GFDL-1.1-only",
      "GFDL-1.1-or-later",
      "GFDL-1.2-invariants-only",
      "GFDL-1.2-invariants-or-later",
      "GFDL-1.2-no-invariants-only",
      "GFDL-1.2-no-invariants-or-later",
      "GFDL-1.2-only",
      "GFDL-1.2-or-later",
      "GFDL-1.3-invariants-only",
      "GFDL-1.3-invariants-or-later",
      "GFDL-1.3-no-invariants-only",
      "GFDL-1.3-no-invariants-or-later",
      "GFDL-1.3-only",
      "GFDL-1.3-or-later",
      "GL2PS",
      "GLWTPL",
      "GPL-1.0-only",
      "GPL-1.0-or-later",
      "GPL-2.0-only",
      "GPL-2.0-or-later",
      "GPL-3.0-only",
      "GPL-3.0-or-later",
      "Game-Programming-Gems",
      "Giftware",
      "Glide",
      "Glulxe",
      "Graphics-Gems",
      "Gutmann",
      "HDF5",
      "HIDAPI",
      "HP-1986",
      "HP-1989",
      "HPND",
      "HPND-DEC",
      "HPND-Fenneberg-Livingston",
      "HPND-INRIA-IMAG",
      "HPND-Intel",
      "HPND-Kevlin-Henney",
      "HPND-MIT-disclaimer",
      "HPND-Markus-Kuhn",
      "HPND-Netrek",
      "HPND-Pbmplus",
      "HPND-SMC",
      "HPND-UC",
      "HPND-UC-export-US",
      "HPND-doc",
      "HPND-doc-sell",
      "HPND-export-US",
      "HPND-export-US-acknowledgement",
      "HPND-export-US-modify",
      "HPND-export2-US",
      "HPND-merchantability-variant",
      "HPND-sell-MIT-disclaimer-xserver",
      "HPND-sell-regexpr",
      "HPND-sell-variant",
      "HPND-sell-variant-MIT-disclaimer",
      "HPND-sell-variant-MIT-disclaimer-rev",
      "HPND-sell-variant-critical-systems",
      "HTMLTIDY",
      "HaskellReport",
      "Hippocratic-2.1",
      "IBM-pibs",
      "ICU",
      "IEC-Code-Components-EULA",
      "IJG",
      "IJG-short",
      "IPA",
      "IPL-1.0",
      "ISC",
      "ISC-Veillard",
      "ISO-permission",
      "ImageMagick",
      "Imlib2",
      "Info-ZIP",
      "Inner-Net-2.0",
      "InnoSetup",
      "Intel",
      "Intel-ACPI",
      "Interbase-1.0",
      "JPL-image",
      "JPNIC",
      "JSON",
      "Jam",
      "JasPer-2.0",
      "Kastrup",
      "Kazlib",
      "Knuth-CTAN",
      "LAL-1.2",
      "LAL-1.3",
      "LGPL-2.0-only",
      "LGPL-2.0-or-later",
      "LGPL-2.1-only",
      "LGPL-2.1-or-later",
      "LGPL-3.0-only",
      "LGPL-3.0-or-later",
      "LGPLLR",
      "LOOP",
      "LPD-document",
      "LPL-1.0",
      "LPL-1.02",
      "LPPL-1.0",
      "LPPL-1.1",
      "LPPL-1.2",
      "LPPL-1.3a",
      "LPPL-1.3c",
      "LZMA-SDK-9.11-to-9.20",
      "LZMA-SDK-9.22",
      "Latex2e",
      "Latex2e-translated-notice",
      "Leptonica",
      "LiLiQ-P-1.1",
      "LiLiQ-R-1.1",
      "LiLiQ-Rplus-1.1",
      "Libpng",
      "Linux-OpenIB",
      "Linux-man-pages-1-para",
      "Linux-man-pages-copyleft",
      "Linux-man-pages-copyleft-2-para",
      "Linux-man-pages-copyleft-var",
      "Lucida-Bitmap-Fonts",
      "MIPS",
      "MIT",
      "MIT-0",
      "MIT-CMU",
      "MIT-Click",
      "MIT-Festival",
      "MIT-Khronos-old",
      "MIT-Modern-Variant",
      "MIT-STK",
      "MIT-Wu",
      "MIT-advertising",
      "MIT-enna",
      "MIT-feh",
      "MIT-open-group",
      "MIT-testregex",
      "MITNFA",
      "MMIXware",
      "MMPL-1.0.1",
      "MPEG-SSG",
      "MPL-1.0",
      "MPL-1.1",
      "MPL-2.0",
      "MPL-2.0-no-copyleft-exception",
      "MS-LPL",
      "MS-PL",
      "MS-RL",
      "MTLL",
      "Mackerras-3-Clause",
      "Mackerras-3-Clause-acknowledgment",
      "MakeIndex",
      "Martin-Birgmeier",
      "McPhee-slideshow",
      "Minpack",
      "MirOS",
      "Motosoto",
      "MulanPSL-1.0",
      "MulanPSL-2.0",
      "Multics",
      "Mup",
      "NAIST-2003",
      "NASA-1.3",
      "NBPL-1.0",
      "NCBI-PD",
      "NCGL-UK-2.0",
      "NCL",
      "NCSA",
      "NGPL",
      "NICTA-1.0",
      "NIST-PD",
      "NIST-PD-TNT",
      "NIST-PD-fallback",
      "NIST-Software",
      "NLOD-1.0",
      "NLOD-2.0",
      "NLPL",
      "NOSL",
      "NPL-1.0",
      "NPL-1.1",
      "NPOSL-3.0",
      "NRL",
      "NTIA-PD",
      "NTP",
      "NTP-0",
      "Naumen",
      "NetCDF",
      "Newsletr",
      "Nokia",
      "Noweb",
      "O-UDA-1.0",
      "OAR",
      "OCCT-PL",
      "OCLC-2.0",
      "ODC-By-1.0",
      "ODbL-1.0",
      "OFFIS",
      "OFL-1.0",
      "OFL-1.0-RFN",
      "OFL-1.0-no-RFN",
      "OFL-1.1",
      "OFL-1.1-RFN",
      "OFL-1.1-no-RFN",
      "OGC-1.0",
      "OGDL-Taiwan-1.0",
      "OGL-Canada-2.0",
      "OGL-UK-1.0",
      "OGL-UK-2.0",
      "OGL-UK-3.0",
      "OGTSL",
      "OLDAP-1.1",
      "OLDAP-1.2",
      "OLDAP-1.3",
      "OLDAP-1.4",
      "OLDAP-2.0",
      "OLDAP-2.0.1",
      "OLDAP-2.1",
      "OLDAP-2.2",
      "OLDAP-2.2.1",
      "OLDAP-2.2.2",
      "OLDAP-2.3",
      "OLDAP-2.4",
      "OLDAP-2.5",
      "OLDAP-2.6",
      "OLDAP-2.7",
      "OLDAP-2.8",
      "OLFL-1.3",
      "OML",
      "OPL-1.0",
      "OPL-UK-3.0",
      "OPUBL-1.0",
      "OSC-1.0",
      "OSET-PL-2.1",
      "OSL-1.0",
      "OSL-1.1",
      "OSL-2.0",
      "OSL-2.1",
      "OSL-3.0",
      "OSSP",
      "OpenMDW-1.0",
      "OpenPBS-2.3",
      "OpenSSL",
      "OpenSSL-standalone",
      "OpenVision",
      "PADL",
      "PDDL-1.0",
      "PHP-3.0",
      "PHP-3.01",
      "PPL",
      "PSF-2.0",
      "ParaType-Free-Font-1.3",
      "Parity-6.0.0",
      "Parity-7.0.0",
      "Pixar",
      "Plexus",
      "PolyForm-Noncommercial-1.0.0",
      "PolyForm-Small-Business-1.0.0",
      "PostgreSQL",
      "Python-2.0",
      "Python-2.0.1",
      "QPL-1.0",
      "QPL-1.0-INRIA-2004",
      "Qhull",
      "RHeCos-1.1",
      "RPL-1.1",
      "RPL-1.5",
      "RPSL-1.0",
      "RSA-MD",
      "RSCPL",
      "Rdisc",
      "Ruby",
      "Ruby-pty",
      "SAX-PD",
      "SAX-PD-2.0",
      "SCEA",
      "SGI-B-1.0",
      "SGI-B-1.1",
      "SGI-B-2.0",
      "SGI-OpenGL",
      "SGMLUG-PM",
      "SGP4",
      "SHL-0.5",
      "SHL-0.51",
      "SISSL",
      "SISSL-1.2",
      "SL",
      "SMAIL-GPL",
      "SMLNJ",
      "SMPPL",
      "SNIA",
      "SOFA",
      "SPL-1.0",
      "SSH-OpenSSH",
      "SSH-short",
      "SSLeay-standalone",
      "SSPL-1.0",
      "SUL-1.0",
      "SWL",
      "Saxpath",
      "SchemeReport",
      "Sendmail",
      "Sendmail-8.23",
      "Sendmail-Open-Source-1.1",
      "SimPL-2.0",
      "Sleepycat",
      "Soundex",
      "Spencer-86",
      "Spencer-94",
      "Spencer-99",
      "SugarCRM-1.1.3",
      "Sun-PPP",
      "Sun-PPP-2000",
      "SunPro",
      "Symlinks",
      "TAPR-OHL-1.0",
      "TCL",
      "TCP-wrappers",
      "TGPPL-1.0",
      "TMate",
      "TORQUE-1.1",
      "TOSL",
      "TPDL",
      "TPL-1.0",
      "TTWL",
      "TTYP0",
      "TU-Berlin-1.0",
      "TU-Berlin-2.0",
      "TekHVC",
      "TermReadKey",
      "ThirdEye",
      "TrustedQSL",
      "UCAR",
      "UCL-1.0",
      "UMich-Merit",
      "UPL-1.0",
      "URT-RLE",
      "Ubuntu-font-1.0",
      "UnRAR",
      "Unicode-3.0",
      "Unicode-DFS-2015",
      "Unicode-DFS-2016",
      "Unicode-TOU",
      "UnixCrypt",
      "Unlicense",
      "Unlicense-libtelnet",
      "Unlicense-libwhirlpool",
      "VOSTROM",
      "VSL-1.0",
      "Vim",
      "Vixie-Cron",
      "W3C",
      "W3C-19980720",
      "W3C-20150513",
      "WTFNMFPL",
      "WTFPL",
      "Watcom-1.0",
      "Widget-Workshop",
      "WordNet",
      "Wsuipa",
      "X11",
      "X11-distribute-modifications-variant",
      "X11-no-permit-persons",
      "X11-swapped",
      "XFree86-1.1",
      "XSkat",
      "Xdebug-1.03",
      "Xerox",
      "Xfig",
      "Xnet",
      "YPL-1.0",
      "YPL-1.1",
      "ZPL-1.1",
      "ZPL-2.0",
      "ZPL-2.1",
      "Zed",
      "Zeeff",
      "Zend-2.0",
      "Zimbra-1.3",
      "Zimbra-1.4",
      "Zlib",
      "any-OSI",
      "any-OSI-perl-modules",
      "bcrypt-Solar-Designer",
      "blessing",
      "bzip2-1.0.6",
      "check-cvs",
      "checkmk",
      "copyleft-next-0.3.0",
      "copyleft-next-0.3.1",
      "curl",
      "cve-tou",
      "diffmark",
      "dtoa",
      "dvipdfm",
      "eGenix",
      "etalab-2.0",
      "fwlw",
      "gSOAP-1.3b",
      "generic-xts",
      "gnuplot",
      "gtkbook",
      "hdparm",
      "hyphen-bulgarian",
      "iMatix",
      "jove",
      "libpng-1.6.35",
      "libpng-2.0",
      "libselinux-1.0",
      "libtiff",
      "libutil-David-Nugent",
      "lsof",
      "magaz",
      "mailprio",
      "man2html",
      "metamail",
      "mpi-permissive",
      "mpich2",
      "mplus",
      "ngrep",
      "pkgconf",
      "pnmstitch",
      "psfrag",
      "psutils",
      "python-ldap",
      "radvd",
      "snprintf",
      "softSurfer",
      "ssh-keyscan",
      "swrule",
      "threeparttable",
      "ulem",
      "w3m",
      "wwl",
      "xinetd",
      "xkeyboard-config-Zinoviev",
      "xlock",
      "xpp",
      "xzoom",
      "zlib-acknowledgement"
    ];
  }
});

// node_modules/.bun/spdx-license-ids@3.0.23/node_modules/spdx-license-ids/deprecated.json
var require_deprecated = __commonJS({
  "node_modules/.bun/spdx-license-ids@3.0.23/node_modules/spdx-license-ids/deprecated.json"(exports, module) {
    module.exports = [
      "AGPL-1.0",
      "AGPL-3.0",
      "BSD-2-Clause-FreeBSD",
      "BSD-2-Clause-NetBSD",
      "GFDL-1.1",
      "GFDL-1.2",
      "GFDL-1.3",
      "GPL-1.0",
      "GPL-2.0",
      "GPL-2.0-with-GCC-exception",
      "GPL-2.0-with-autoconf-exception",
      "GPL-2.0-with-bison-exception",
      "GPL-2.0-with-classpath-exception",
      "GPL-2.0-with-font-exception",
      "GPL-3.0",
      "GPL-3.0-with-GCC-exception",
      "GPL-3.0-with-autoconf-exception",
      "LGPL-2.0",
      "LGPL-2.1",
      "LGPL-3.0",
      "Net-SNMP",
      "Nunit",
      "StandardML-NJ",
      "bzip2-1.0.5",
      "eCos-2.0",
      "wxWindows"
    ];
  }
});

// node_modules/.bun/spdx-exceptions@2.5.0/node_modules/spdx-exceptions/index.json
var require_spdx_exceptions = __commonJS({
  "node_modules/.bun/spdx-exceptions@2.5.0/node_modules/spdx-exceptions/index.json"(exports, module) {
    module.exports = [
      "389-exception",
      "Asterisk-exception",
      "Autoconf-exception-2.0",
      "Autoconf-exception-3.0",
      "Autoconf-exception-generic",
      "Autoconf-exception-generic-3.0",
      "Autoconf-exception-macro",
      "Bison-exception-1.24",
      "Bison-exception-2.2",
      "Bootloader-exception",
      "Classpath-exception-2.0",
      "CLISP-exception-2.0",
      "cryptsetup-OpenSSL-exception",
      "DigiRule-FOSS-exception",
      "eCos-exception-2.0",
      "Fawkes-Runtime-exception",
      "FLTK-exception",
      "fmt-exception",
      "Font-exception-2.0",
      "freertos-exception-2.0",
      "GCC-exception-2.0",
      "GCC-exception-2.0-note",
      "GCC-exception-3.1",
      "Gmsh-exception",
      "GNAT-exception",
      "GNOME-examples-exception",
      "GNU-compiler-exception",
      "gnu-javamail-exception",
      "GPL-3.0-interface-exception",
      "GPL-3.0-linking-exception",
      "GPL-3.0-linking-source-exception",
      "GPL-CC-1.0",
      "GStreamer-exception-2005",
      "GStreamer-exception-2008",
      "i2p-gpl-java-exception",
      "KiCad-libraries-exception",
      "LGPL-3.0-linking-exception",
      "libpri-OpenH323-exception",
      "Libtool-exception",
      "Linux-syscall-note",
      "LLGPL",
      "LLVM-exception",
      "LZMA-exception",
      "mif-exception",
      "OCaml-LGPL-linking-exception",
      "OCCT-exception-1.0",
      "OpenJDK-assembly-exception-1.0",
      "openvpn-openssl-exception",
      "PS-or-PDF-font-exception-20170817",
      "QPL-1.0-INRIA-2004-exception",
      "Qt-GPL-exception-1.0",
      "Qt-LGPL-exception-1.1",
      "Qwt-exception-1.0",
      "SANE-exception",
      "SHL-2.0",
      "SHL-2.1",
      "stunnel-exception",
      "SWI-exception",
      "Swift-exception",
      "Texinfo-exception",
      "u-boot-exception-2.0",
      "UBDL-exception",
      "Universal-FOSS-exception-1.0",
      "vsftpd-openssl-exception",
      "WxWindows-exception-3.1",
      "x11vnc-openssl-exception"
    ];
  }
});

// node_modules/.bun/spdx-expression-parse@5.0.0/node_modules/spdx-expression-parse/scan.js
var require_scan = __commonJS({
  "node_modules/.bun/spdx-expression-parse@5.0.0/node_modules/spdx-expression-parse/scan.js"(exports, module) {
    "use strict";
    var licenses = [].concat(require_spdx_license_ids()).concat(require_deprecated());
    var exceptions = require_spdx_exceptions();
    module.exports = function(source) {
      var index = 0;
      function hasMore() {
        return index < source.length;
      }
      function read(value) {
        if (value instanceof RegExp) {
          var chars = source.slice(index);
          var match = chars.match(value);
          if (match) {
            index += match[0].length;
            return match[0];
          }
        } else {
          if (source.indexOf(value, index) === index) {
            index += value.length;
            return value;
          }
        }
      }
      function skipWhitespace() {
        read(/[ ]*/);
      }
      function operator() {
        var string;
        var possibilities = [/^WITH/i, /^AND/i, /^OR/i, "(", ")", ":", "+"];
        for (var i = 0; i < possibilities.length; i++) {
          string = read(possibilities[i]);
          if (string) {
            break;
          }
        }
        if (string === "+" && index > 1 && source[index - 2] === " ") {
          throw new Error("Space before `+`");
        }
        return string && {
          type: "OPERATOR",
          string: string.toUpperCase()
        };
      }
      function idstring() {
        return read(/[A-Za-z0-9-.]+/);
      }
      function expectIdstring() {
        var string = idstring();
        if (!string) {
          throw new Error("Expected idstring at offset " + index);
        }
        return string;
      }
      function documentRef() {
        if (read("DocumentRef-")) {
          var string = expectIdstring();
          return { type: "DOCUMENTREF", string };
        }
      }
      function licenseRef() {
        if (read("LicenseRef-")) {
          var string = expectIdstring();
          return { type: "LICENSEREF", string };
        }
      }
      function identifier() {
        var begin = index;
        var string = idstring();
        if (licenses.indexOf(string) !== -1) {
          return {
            type: "LICENSE",
            string
          };
        } else if (exceptions.indexOf(string) !== -1) {
          return {
            type: "EXCEPTION",
            string
          };
        }
        index = begin;
      }
      function parseToken() {
        return operator() || documentRef() || licenseRef() || identifier();
      }
      var tokens = [];
      while (hasMore()) {
        skipWhitespace();
        if (!hasMore()) {
          break;
        }
        var token = parseToken();
        if (!token) {
          throw new Error("Unexpected `" + source[index] + "` at offset " + index);
        }
        tokens.push(token);
      }
      return tokens;
    };
  }
});

// node_modules/.bun/spdx-expression-parse@5.0.0/node_modules/spdx-expression-parse/parse.js
var require_parse = __commonJS({
  "node_modules/.bun/spdx-expression-parse@5.0.0/node_modules/spdx-expression-parse/parse.js"(exports, module) {
    "use strict";
    module.exports = function(tokens) {
      var index = 0;
      function hasMore() {
        return index < tokens.length;
      }
      function token() {
        return hasMore() ? tokens[index] : null;
      }
      function next() {
        if (!hasMore()) {
          throw new Error();
        }
        index++;
      }
      function parseOperator(operator) {
        var t = token();
        if (t && t.type === "OPERATOR" && operator === t.string) {
          next();
          return t.string;
        }
      }
      function parseWith() {
        if (parseOperator("WITH")) {
          var t = token();
          if (t && t.type === "EXCEPTION") {
            next();
            return t.string;
          }
          throw new Error("Expected exception after `WITH`");
        }
      }
      function parseLicenseRef() {
        var begin = index;
        var string = "";
        var t = token();
        if (t.type === "DOCUMENTREF") {
          next();
          string += "DocumentRef-" + t.string + ":";
          if (!parseOperator(":")) {
            throw new Error("Expected `:` after `DocumentRef-...`");
          }
        }
        t = token();
        if (t === null) {
          throw new Error("Unexpected end of input");
        }
        if (t.type === "LICENSEREF") {
          next();
          string += "LicenseRef-" + t.string;
          var node2 = { license: string };
          var exception = parseWith();
          if (exception) {
            node2.exception = exception;
          }
          return node2;
        }
        index = begin;
      }
      function parseLicense() {
        var t = token();
        if (t && t.type === "LICENSE") {
          next();
          var node2 = { license: t.string };
          if (parseOperator("+")) {
            node2.plus = true;
          }
          var exception = parseWith();
          if (exception) {
            node2.exception = exception;
          }
          return node2;
        }
      }
      function parseParenthesizedExpression() {
        var left = parseOperator("(");
        if (!left) {
          return;
        }
        var expr = parseExpression();
        if (!parseOperator(")")) {
          throw new Error("Expected `)`");
        }
        return expr;
      }
      function parseAtom() {
        return parseParenthesizedExpression() || parseLicenseRef() || parseLicense();
      }
      function makeBinaryOpParser(operator, nextParser) {
        return function parseBinaryOp() {
          var left = nextParser();
          if (!left) {
            return;
          }
          if (!parseOperator(operator)) {
            return left;
          }
          var right = parseBinaryOp();
          if (!right) {
            throw new Error("Expected expression");
          }
          return {
            left,
            conjunction: operator.toLowerCase(),
            right
          };
        };
      }
      var parseAnd = makeBinaryOpParser("AND", parseAtom);
      var parseExpression = makeBinaryOpParser("OR", parseAnd);
      var node = parseExpression();
      if (!node || hasMore()) {
        throw new Error("Syntax error");
      }
      return node;
    };
  }
});

// node_modules/.bun/spdx-expression-parse@5.0.0/node_modules/spdx-expression-parse/index.js
var require_spdx_expression_parse = __commonJS({
  "node_modules/.bun/spdx-expression-parse@5.0.0/node_modules/spdx-expression-parse/index.js"(exports, module) {
    "use strict";
    var scan = require_scan();
    var parse = require_parse();
    module.exports = function(source) {
      return parse(scan(source));
    };
  }
});

// tooling/plugin-sdk/community.ts
import { appendFile, readdir as readdir3, readFile as readFile3, writeFile as writeFile3 } from "node:fs/promises";
import path4 from "node:path";
import { parseArgs } from "node:util";

// packages/api/src/lib/utils/isRecord.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function assertRecord(value, label) {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  return value;
}
function cloneJsonRecord(value, label) {
  assertRecord(value, label);
  let clone;
  try {
    clone = JSON.parse(JSON.stringify(value));
  } catch (error) {
    throw new Error(`${label} must contain JSON-compatible data`, { cause: error });
  }
  return assertRecord(clone, label);
}

// packages/api/src/lib/utils/lazy.ts
var unconfigurable = /* @__PURE__ */ new Set(["arguments", "caller", "prototype"]);
var isUnconfigurable = (key) => typeof key === "string" && unconfigurable.has(key);
var proxyContextHolder = /* @__PURE__ */ new WeakMap();
function resolveTarget(target, operation) {
  const resolved = proxyContextHolder.get(target)?.factory();
  if (!resolved) throw new Error(`Trying to ${operation} of ${typeof resolved}`);
  return resolved;
}
var lazyHandler = {
  ...Object.fromEntries(
    Object.getOwnPropertyNames(Reflect).filter((fnName) => fnName !== "apply").map((fnName) => {
      return [
        fnName,
        (target, ...args) => (
          // @ts-expect-error
          Reflect[fnName](resolveTarget(target, `Reflect.${fnName}`), ...args)
        )
      ];
    })
  ),
  apply(target, thisArg, args) {
    const contextHolder = proxyContextHolder.get(target);
    const resolved = contextHolder?.factory();
    if (typeof resolved === "function") {
      return Reflect.apply(resolved, thisArg, args);
    }
    if (window.React) {
      return window.React.createElement(resolved, args[0]);
    }
    throw new Error(`Cannot call ${typeof resolved} as a function`);
  },
  has(target, p) {
    const contextHolder = proxyContextHolder.get(target);
    if (contextHolder?.options) {
      const { exemptedEntries: isolatedEntries } = contextHolder.options;
      if (isolatedEntries && p in isolatedEntries) return true;
    }
    return Reflect.has(resolveTarget(target, "Reflect.has"), p);
  },
  get(target, p, receiver) {
    if (__DEV__ && p === "__IS_SNOW_LAZY_PROXY__") return true;
    const contextHolder = proxyContextHolder.get(target);
    if (contextHolder?.options) {
      const { exemptedEntries: isolatedEntries } = contextHolder.options;
      if (isolatedEntries?.[p]) return isolatedEntries[p];
    }
    return Reflect.get(resolveTarget(target, "Reflect.get"), p, receiver);
  },
  ownKeys: (target) => {
    const cacheKeys = Reflect.ownKeys(resolveTarget(target, "Reflect.ownKeys"));
    unconfigurable.forEach((key) => !cacheKeys.includes(key) && cacheKeys.push(key));
    return cacheKeys;
  },
  getOwnPropertyDescriptor: (target, p) => {
    if (isUnconfigurable(p)) return Reflect.getOwnPropertyDescriptor(target, p);
    const descriptor = Reflect.getOwnPropertyDescriptor(
      resolveTarget(target, "getOwnPropertyDescriptor"),
      p
    );
    if (descriptor) Object.defineProperty(target, p, descriptor);
    return descriptor;
  }
};

// packages/api/src/lib/https-url.ts
var MAX_URL_BYTES = 2048;
function requireRemoteURL(value, label) {
  if (typeof value !== "string") throw new Error(`${label} must be a URL string`);
  if (new TextEncoder().encode(value).byteLength > MAX_URL_BYTES) {
    throw new Error(`${label} exceeds the ${MAX_URL_BYTES}-byte limit`);
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid URL`);
  }
  if (url.protocol !== "https:" || !url.hostname || url.username || url.password) {
    throw new Error(`${label} must use HTTPS without embedded credentials`);
  }
  if (url.hash) throw new Error(`${label} must not contain a fragment`);
  return url;
}

// plugins/core/painter/fonts/definition.ts
var EMOJI_PACK_TYPE = "emoji";
var EMOJI_ENTRY = "emoji";
function isEmojiPack(definition) {
  return definition.type === EMOJI_PACK_TYPE;
}
function requireEmojiEntry(main) {
  const families = Object.keys(main);
  if (families.length !== 1 || families[0] !== EMOJI_ENTRY) {
    throw new Error("Emoji packs need exactly one entry named emoji");
  }
  const source = main[EMOJI_ENTRY];
  if (typeof source !== "string" && !("url" in source && source.axes === void 0)) {
    throw new Error("The emoji entry must be a single font file");
  }
}
var MAX_SEGMENT_LENGTH = 128;
var MAX_FONT_ENTRIES = 64;
function requireFontPathSegment(value, label) {
  if (typeof value !== "string" || value.length === 0 || value.length > MAX_SEGMENT_LENGTH) {
    throw new Error(`${label} must contain between 1 and ${MAX_SEGMENT_LENGTH} characters`);
  }
  if (value === "." || value === ".." || value.includes("/") || value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new Error(`${label} must be a single safe path segment`);
  }
  return value;
}
var MAX_FONT_AXES = 16;
var axisTagPattern = /^[\x20\x21\x23-\x26\x28-\x7e]{4}$/;
function parseAxes(value, family) {
  const entries = Object.entries(assertRecord(value, `Font axes for ${family}`));
  if (entries.length > MAX_FONT_AXES) {
    throw new Error(`Font entry ${family} can set at most ${MAX_FONT_AXES} axes`);
  }
  const axes = {};
  for (const [tag, amount] of entries) {
    if (!axisTagPattern.test(tag)) {
      throw new Error(`Font axis ${tag} for ${family} must be a four-character tag`);
    }
    if (typeof amount !== "number" || !Number.isFinite(amount)) {
      throw new Error(`Font axis ${tag} for ${family} must be a finite number`);
    }
    axes[tag] = amount;
  }
  return axes;
}
function parseFontSource(value, family, spec) {
  if (!isRecord(value) || spec !== 3) {
    return requireRemoteURL(value, `Font source for ${family}`).href;
  }
  if (value.system === true && value.url === void 0 && value.axes === void 0) {
    return { system: true };
  }
  if (value.url === void 0) throw new Error(`Font entry ${family} needs a url`);
  const url = requireRemoteURL(value.url, `Font source for ${family}`).href;
  return value.axes === void 0 ? { url } : { url, axes: parseAxes(value.axes, family) };
}
function parseFontDefinition(value) {
  const candidate = assertRecord(value, "Font definition");
  const spec = candidate.spec === void 0 ? 1 : candidate.spec;
  if (spec !== 1 && spec !== 2 && spec !== 3) {
    throw new Error("Font spec must be 1, 2, or 3");
  }
  const name = requireFontPathSegment(candidate.name, "Font name");
  if (name.startsWith("__")) throw new Error("Font names cannot start with __");
  if (!isRecord(candidate.main)) throw new Error("Font definition must include a main object");
  const entries = Object.entries(candidate.main);
  if (entries.length > MAX_FONT_ENTRIES) {
    throw new Error(`Font definition exceeds the ${MAX_FONT_ENTRIES}-entry limit`);
  }
  const main = {};
  for (const [family, source] of entries) {
    const safeFamily = requireFontPathSegment(family, "Font family");
    if (isRecord(source) && spec !== 3) {
      throw new Error(`Font entry ${safeFamily} uses an object, which needs spec 3`);
    }
    main[safeFamily] = parseFontSource(source, safeFamily, spec);
  }
  if (Object.keys(main).length === 0) throw new Error("Font definition must not be empty");
  const definition = { spec, name, main };
  if (candidate.type !== void 0) {
    if (typeof candidate.type !== "string" || candidate.type.length > 128) {
      throw new Error("Font type must be a string no longer than 128 characters");
    }
    definition.type = candidate.type;
    if (isEmojiPack(definition)) requireEmojiEntry(main);
  }
  if (candidate.description !== void 0) {
    if (typeof candidate.description !== "string" || candidate.description.length > 1e3) {
      throw new Error("Font description must be a string no longer than 1000 characters");
    }
    definition.description = candidate.description;
  }
  if (candidate.source !== void 0) {
    definition.source = requireRemoteURL(candidate.source, "Font manifest source").href;
  }
  return definition;
}

// plugins/core/painter/themes/manifest.ts
function getThemeMetadata(manifest) {
  const display = manifest.spec === 3 ? manifest.display : manifest;
  return {
    authors: display.authors ?? [],
    description: display.description ?? "",
    name: display.name
  };
}

// plugins/core/painter/themes/validate.ts
var import_color_name = __toESM(require_color_name());
var MAX_AUTHORS = 16;
var MAX_COLOR_ENTRIES = 512;
var namedColors = /* @__PURE__ */ new Set([...Object.keys(import_color_name.default), "transparent"]);
var numberPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
function requireString(value, label, maxLength) {
  if (typeof value !== "string" || value.length === 0 || value.length > maxLength) {
    throw new Error(`${label} must contain between 1 and ${maxLength} characters`);
  }
  return value;
}
function optionalString(value, label, maxLength) {
  if (value !== void 0) requireString(value, label, maxLength);
}
function requireUnitInterval(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${label} must be a finite number between 0 and 1`);
  }
  return value;
}
function validateAuthors(value) {
  if (value === void 0) return;
  if (!Array.isArray(value) || value.length > MAX_AUTHORS) {
    throw new Error(`Theme authors must be an array of at most ${MAX_AUTHORS} entries`);
  }
  for (const author of value) {
    if (!isRecord(author)) throw new Error("Theme author must be an object");
    requireString(author.name, "Theme author name", 100);
    if (author.id !== void 0 && !/^\d{1,32}$/.test(String(author.id))) {
      throw new Error("Theme author ID must be a decimal identifier");
    }
  }
}
function validateEntryCount(value, label) {
  if (Object.keys(value).length > MAX_COLOR_ENTRIES) {
    throw new Error(`${label} exceeds the ${MAX_COLOR_ENTRIES}-entry limit`);
  }
}
function validateBackground(value, alphaKey, label = "Theme background") {
  if (value === void 0) return;
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  if (value.url === "") delete value.url;
  if (value.url !== void 0) {
    value.url = requireRemoteURL(value.url, `${label} URL`).href;
  }
  if (value.color !== void 0) value.color = requireColor(value.color, `${label} color`);
  if (value.blur !== void 0) {
    if (typeof value.blur !== "number" || !Number.isFinite(value.blur) || value.blur < 0 || value.blur > 100) {
      throw new Error(`${label} blur must be between 0 and 100`);
    }
  }
  if (value[alphaKey] !== void 0) {
    requireUnitInterval(value[alphaKey], `${label} ${alphaKey}`);
  }
  if (value.surfaceOpacity !== void 0) {
    requireUnitInterval(value.surfaceOpacity, `${label} surfaceOpacity`);
  }
}
function validateStringMap(value, label, allowFalse = false) {
  if (value === void 0) return;
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  validateEntryCount(value, label);
  for (const [key, color] of Object.entries(value)) {
    requireString(key, `${label} key`, 128);
    if (allowFalse && color === false) continue;
    value[key] = requireColor(color, `${label} ${key}`);
  }
}
function validateSemanticMap(value, label, allowFalse = false) {
  if (value === void 0) return;
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  validateEntryCount(value, label);
  for (const [key, color] of Object.entries(value)) {
    requireString(key, `${label} key`, 128);
    if (allowFalse && color === false) continue;
    if (typeof color === "string") {
      requireString(color, `${label} ${key}`, 128);
      continue;
    }
    if (!isRecord(color) || color.type !== "color" && color.type !== "raw") {
      throw new Error("Theme semantic reference must have type color or raw");
    }
    requireString(color.value, "Theme semantic reference value", 128);
    if (color.opacity !== void 0) {
      requireUnitInterval(color.opacity, "Theme semantic reference opacity");
    }
  }
}
var themeTypes = /* @__PURE__ */ new Set(["dark", "midnight", "light", "ash"]);
function validateByType(value) {
  if (value === void 0) return;
  if (!isRecord(value)) throw new Error("Theme byType must be an object");
  for (const [type, colors] of Object.entries(value)) {
    if (!themeTypes.has(type)) {
      console.warn(`Ignored unknown theme base ${type}`);
      delete value[type];
      continue;
    }
    const label = `Theme byType.${type}`;
    if (!isRecord(colors)) throw new Error(`${label} must be an object`);
    validateSemanticMap(colors.semantic, `${label} semantic colors`, true);
    validateStringMap(colors.raw, `${label} raw colors`, true);
    if (colors.background !== false) {
      validateBackground(colors.background, "opacity", `${label} background`);
    }
  }
}
function boundedNumber(value, maximum, percent = false) {
  const token = value.trim();
  const isPercent = token.endsWith("%");
  if (isPercent !== percent) return false;
  const raw = isPercent ? token.slice(0, -1) : token;
  return numberPattern.test(raw) && Number(raw) >= 0 && Number(raw) <= maximum;
}
function validAlpha(value) {
  return value.trim().endsWith("%") ? boundedNumber(value, 100, true) : boundedNumber(value, 1);
}
function validRgbChannel(value) {
  return value.trim().endsWith("%") ? boundedNumber(value, 100, true) : boundedNumber(value, 255);
}
function functionalParts(body) {
  const slash = body.split("/");
  if (slash.length > 2) return { components: [] };
  return {
    components: slash[0].trim().split(/\s+/),
    alpha: slash[1]?.trim()
  };
}
function validRgb(value) {
  const match = /^rgba?\((.*)\)$/i.exec(value);
  if (!match) return false;
  if (match[1].includes(",")) {
    const parts = match[1].split(",").map((part) => part.trim());
    const expected = value.toLowerCase().startsWith("rgba(") ? 4 : 3;
    return parts.length === expected && parts.slice(0, 3).every(validRgbChannel) && (parts[3] === void 0 || validAlpha(parts[3]));
  }
  const { components, alpha } = functionalParts(match[1]);
  return components.length === 3 && components.every(validRgbChannel) && (alpha === void 0 || validAlpha(alpha));
}
function validHsl(value) {
  const match = /^hsla?\((.*)\)$/i.exec(value);
  if (!match) return false;
  const commaParts = match[1].includes(",") ? match[1].split(",").map((part) => part.trim()) : void 0;
  if (commaParts && commaParts.length !== 3 && commaParts.length !== 4) return false;
  const { components, alpha } = commaParts ? { components: commaParts.slice(0, 3), alpha: commaParts[3] } : functionalParts(match[1]);
  const hue = components[0]?.replace(/(?:deg|rad|turn)$/i, "") ?? "";
  return components.length === 3 && numberPattern.test(hue) && boundedNumber(components[1], 100, true) && boundedNumber(components[2], 100, true) && (alpha === void 0 || validAlpha(alpha));
}
function requireColor(value, label) {
  const input = requireString(value, label, 128).trim();
  const color = /^(?:[\da-f]{6}|[\da-f]{8})$/i.test(input) ? `#${input}` : input;
  const validHex = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(color);
  const validName = namedColors.has(color.toLowerCase());
  const validFunction = validRgb(color) || validHsl(color);
  if (!validHex && !validName && !validFunction) {
    throw new Error(`${label} must be a valid color`);
  }
  return color;
}
function validateSpec3(candidate) {
  requireString(candidate.id, "Theme ID", 128);
  requireString(candidate.version, "Theme version", 64);
  requireString(candidate.type, "Theme type", 32);
  if (!isRecord(candidate.display)) throw new Error("Theme display must be an object");
  requireString(candidate.display.name, "Theme name", 100);
  optionalString(candidate.display.description, "Theme description", 1e3);
  validateAuthors(candidate.display.authors);
  if (!isRecord(candidate.main)) throw new Error("Theme main must be an object");
  if (candidate.main.type !== "dark" && candidate.main.type !== "light") {
    throw new Error("Theme main type must be dark or light");
  }
  validateStringMap(candidate.main.raw, "Theme raw colors");
  validateBackground(candidate.main.background, "opacity");
  validateSemanticMap(candidate.main.semantic, "Theme semantic colors");
  validateByType(candidate.main.byType);
}
function validateSpec2(candidate) {
  requireString(candidate.name, "Theme name", 100);
  optionalString(candidate.description, "Theme description", 1e3);
  validateAuthors(candidate.authors);
  validateStringMap(candidate.rawColors, "Theme raw colors");
  validateBackground(candidate.background, "alpha");
  if (candidate.semanticColors !== void 0) {
    if (!isRecord(candidate.semanticColors)) {
      throw new Error("Theme semantic colors must be an object");
    }
    validateEntryCount(candidate.semanticColors, "Theme semantic colors");
    for (const [key, colors] of Object.entries(candidate.semanticColors)) {
      requireString(key, "Theme semantic color key", 128);
      if (!Array.isArray(colors) || colors.length === 0 || colors.length > 3) {
        throw new Error("Vendetta semantic colors must contain one to three values");
      }
      for (let index = 0; index < colors.length; index++) {
        if (colors[index] !== false) {
          colors[index] = requireColor(colors[index], `Theme semantic color ${key}`);
        }
      }
    }
  }
}
function validateLegacy(candidate) {
  requireString(candidate.name, "Theme name", 100);
  optionalString(candidate.description, "Theme description", 1e3);
  validateAuthors(candidate.authors);
  validateStringMap(candidate.colors, "Theme colors");
  validateStringMap(candidate.colours, "Theme colours");
  validateStringMap(candidate.unsafe_colors, "Theme unsafe colors");
  validateBackground(candidate.background, "alpha");
  if (isRecord(candidate.background) && candidate.background.opacity !== void 0) {
    requireUnitInterval(candidate.background.opacity, "Theme background opacity");
  }
  if (candidate.theme_color_map !== void 0) {
    if (!isRecord(candidate.theme_color_map)) {
      throw new Error("Theme color map must be an object");
    }
    validateEntryCount(candidate.theme_color_map, "Theme color map");
    for (const [key, colors] of Object.entries(candidate.theme_color_map)) {
      requireString(key, "Theme color map key", 128);
      if (!Array.isArray(colors) || colors.length !== 2) {
        throw new Error("Theme color map values must contain dark and light colors");
      }
      for (let index = 0; index < colors.length; index++) {
        colors[index] = requireColor(colors[index], `Theme color map ${key}`);
      }
    }
  }
}
function parseThemeManifest(value) {
  const candidate = cloneJsonRecord(value, "Theme manifest");
  if (candidate.spec === void 0) {
    if (candidate.theme_color_map || candidate.colours || candidate.colors || candidate.unsafe_colors) {
      candidate.spec = 1;
    } else if (candidate.semanticColors || candidate.rawColors || candidate.background) {
      candidate.spec = 2;
    }
  }
  if (candidate.spec === 3) validateSpec3(candidate);
  else if (candidate.spec === 2) validateSpec2(candidate);
  else if (candidate.spec === 1) validateLegacy(candidate);
  else {
    throw new Error("Theme spec must be 1, 2, or 3");
  }
  if (candidate.fonts !== void 0) {
    candidate.fonts = parseFontDefinition({ name: "Theme", main: candidate.fonts }).main;
  }
  return candidate;
}

// tooling/plugin-sdk/plugin-repository.ts
import { cp, mkdir as mkdir2, readdir as readdir2, readFile as readFile2, rm as rm2, stat, writeFile as writeFile2 } from "node:fs/promises";
import path3 from "node:path";

// tooling/shared/paths.ts
import path from "node:path";
var projectRoot = path.resolve(import.meta.dir, "../..");
var typescriptCompiler = path.join(projectRoot, "node_modules/.bin/tsc");

// packages/core/src/plugins/identifiers.ts
var PLUGIN_ID = /^[a-z][a-z0-9.-]{0,127}$/;

// packages/core/src/plugins/manifest-fields.ts
var import_spdx_expression_parse = __toESM(require_spdx_expression_parse(), 1);
function requireString2(value, label, maximum) {
  if (typeof value !== "string" || value.length === 0 || value.length > maximum) {
    throw new Error(`${label} must contain between 1 and ${maximum} characters`);
  }
  if (/[\u0000-\u001f\u007f]/.test(value)) {
    throw new Error(`${label} must not contain control characters`);
  }
  return value;
}
function requireId(value, label = "Plugin ID", allowCore = false) {
  const id = requireString2(value, label, 128);
  if (!PLUGIN_ID.test(id)) {
    throw new Error(`${label} must use lowercase letters, numbers, dots, or hyphens`);
  }
  if (!allowCore && id.startsWith("core.")) {
    throw new Error(`${label} uses the reserved core namespace`);
  }
  return id;
}

// packages/core/src/plugins/manifest.ts
var MAX_EXTERNAL_PLUGIN_BYTES = 1024 * 1024;

// packages/core/src/plugins/repositories/semver.ts
var IDENTIFIER = "(?:0|[1-9]\\d*|\\d*[A-Za-z-][0-9A-Za-z-]*)";
var RELEASE_VERSION = new RegExp(
  `^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-(${IDENTIFIER}(?:\\.${IDENTIFIER})*))?$`
);

// packages/core/src/plugins/repositories/index-format.ts
var MAX_INDEX_BYTES = 1024 * 1024;
var MAX_PLUGIN_MANIFEST_BYTES = 64 * 1024;
var MAX_DATA_MANIFEST_BYTES = 256 * 1024;

// tooling/plugin-sdk/plugin-sdk.ts
import { mkdir, mkdtemp, readFile, realpath, readdir, writeFile, rm } from "node:fs/promises";
import path2 from "node:path";
import { build, transform } from "esbuild";
import { parseSync, transformSync } from "@swc/core";

// tooling/build/hermes-transform.ts
import { transformFile } from "@swc/core";

// tooling/shared/process.ts
var DEFAULT_MAXIMUM_OUTPUT_BYTES = 64 * 1024 * 1024;

// tooling/build/hermes.ts
var executableName = process.platform === "win32" ? "hermesc.exe" : "hermesc";
var platformDirectories = {
  darwin: "osx-bin",
  win32: "win64-bin"
};
var platformDirectory = platformDirectories[process.platform] ?? "linux64-bin";

// tooling/plugin-sdk/plugin-sdk.ts
async function pluginDirectories(root) {
  if (await Bun.file(path2.join(root, "snow.plugin.json")).exists()) return [root];
  const directory = path2.join(root, "plugins");
  const entries = await readdir(directory, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => path2.join(directory, entry.name)).sort();
}

// tooling/plugin-sdk/plugin-repository.ts
var DATA_FOLDERS = /* @__PURE__ */ new Set(["themes", "fonts"]);
var MAX_DATA_BYTES = 256 * 1024;
async function safeEntries(directory) {
  const entries = await readdir2(directory, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => !entry.isSymbolicLink() && !entry.name.startsWith(".")).sort((left, right) => left.name.localeCompare(right.name));
}
async function workspacePlugins(root) {
  const plugins = [];
  for (const directory of await pluginDirectories(root).catch(() => [])) {
    const manifest = JSON.parse(
      await readFile2(path3.join(directory, "snow.plugin.json"), "utf8")
    );
    const id = requireId(manifest.id);
    if (DATA_FOLDERS.has(id))
      throw new Error(`Plugin ID ${id} is reserved for repository files`);
    const other = plugins.find((plugin) => plugin.id === id);
    if (other) {
      throw new Error(
        `Plugin ID ${id} is used by both ${path3.relative(root, other.directory) || "."} and ${path3.relative(root, directory)}`
      );
    }
    plugins.push({ id, directory });
  }
  return plugins;
}

// tooling/plugin-sdk/community.ts
var KINDS = ["plugin", "theme", "font"];
var record = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
var text = (value) => typeof value === "string" ? value : "";
var authorNames = (value) => Array.isArray(value) ? value.map(record).filter((author) => author.role !== "contributor").map((author) => text(author.name)).filter(Boolean) : [];
async function readJSON(file) {
  return record(JSON.parse(await readFile3(file, "utf8")));
}
async function sourceEntries(root, errors) {
  const entries = [];
  for (const { directory } of await workspacePlugins(root)) {
    const json = await readJSON(path4.join(directory, "snow.plugin.json"));
    entries.push({
      kind: "plugin",
      folder: path4.basename(directory),
      directory,
      id: text(json.id),
      name: text(json.name),
      description: text(json.description),
      authors: authorNames(json.authors),
      json
    });
  }
  for (const kind of ["theme", "font"]) {
    for (const folder of await safeEntries(path4.join(root, `${kind}s`))) {
      if (!folder.isDirectory()) continue;
      const directory = path4.join(root, `${kind}s`, folder.name);
      const file = path4.join(directory, `${kind}.json`);
      try {
        const json = await readJSON(file);
        if (kind === "theme") {
          const manifest = parseThemeManifest(json);
          const metadata = getThemeMetadata(manifest);
          const id = "id" in manifest ? text(manifest.id) : "";
          entries.push({
            kind,
            folder: folder.name,
            directory,
            id: id || folder.name,
            name: metadata.name,
            description: metadata.description,
            authors: metadata.authors.map((author) => author.name),
            json
          });
        } else {
          const definition = parseFontDefinition(json);
          entries.push({
            kind,
            folder: folder.name,
            directory,
            id: folder.name,
            name: definition.name,
            description: definition.description ?? "",
            authors: [],
            json
          });
        }
      } catch (error) {
        errors.push(`${path4.relative(root, file)}: ${error.message}`);
      }
    }
  }
  return entries;
}
var cell = (value) => value.replaceAll("|", "\\|").replace(/\s*\n\s*/g, " ");
function table(root, entries) {
  if (!entries.length) return "_None yet._";
  return [
    "| Name | Description | Authors | ID |",
    "| --- | --- | --- | --- |",
    ...entries.map(
      (entry) => `| [${cell(entry.name)}](${path4.relative(root, entry.directory).split(path4.sep).join("/")}) | ${cell(entry.description)} | ${cell(entry.authors.join(", "))} | \`${entry.id}\` |`
    )
  ].join("\n");
}
async function runBuildReadme(args, root = process.cwd()) {
  const { values } = parseArgs({ args, options: { check: { type: "boolean", default: false } } });
  const file = path4.join(root, "README.md");
  const before = await readFile3(file, "utf8");
  const errors = [];
  const entries = await sourceEntries(root, errors);
  let after = before;
  for (const kind of KINDS) {
    const start = `<!-- snow:${kind}s -->`;
    const end = `<!-- /snow:${kind}s -->`;
    const from = after.indexOf(start);
    const to = after.indexOf(end);
    if (from < 0 || to < from) continue;
    const rows = table(
      root,
      entries.filter((entry) => entry.kind === kind)
    );
    after = `${after.slice(0, from + start.length)}
${rows}
${after.slice(to)}`;
  }
  for (const error of errors) console.error(error);
  if (values.check) {
    const fresh = after === before && !errors.length;
    console.log(
      fresh ? "README tables are current" : "README tables are stale; run build:readme"
    );
    if (!fresh) process.exitCode = 1;
    return fresh;
  }
  if (after !== before) await writeFile3(file, after);
  console.log(after === before ? "README tables are current" : "Updated README tables");
  if (errors.length) process.exitCode = 1;
  return !errors.length;
}

// <stdin>
await runBuildReadme(process.argv.slice(2));
