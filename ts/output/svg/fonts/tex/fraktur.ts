/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import {SvgCharMap, AddPaths} from '../../FontData.js';
import {fraktur as font} from '../../../common/fonts/tex/fraktur.js';

export const fraktur: SvgCharMap = AddPaths(font, {
    0x21: '102 582T102 620T112 673T152 689Q190 689 190 638Q190 605 167 373L148 187L133 184Q102 582 102 620ZM91 24T91 48T107 88T148 104Q171 104 187 87T204 48Q204 22 188 5T149 -12Q124 -12 108 6',
    0x22: '33 436Q8 603 8 648Q8 663 9 671T19 687T43 695Q63 695 74 681Q76 678 76 650V623L66 532Q57 443 55 436V432H33V436ZM128 666Q128 691 162 691T196 668Q196 634 186 531Q176 441 176 432H166Q155 432 155 434L142 545Q135 603 130 647Q128 664 128 666',
    0x26: '181 520Q181 604 231 650T328 697L330 698Q333 698 335 698Q336 698 340 698T346 697Q390 697 418 670T446 604Q446 554 414 511Q384 467 300 417L283 406Q281 405 296 374T347 286T425 182Q466 135 469 135Q470 135 473 140T480 152T486 165Q509 210 509 263Q509 282 507 292Q498 317 488 332T465 352T443 359T418 361Q388 361 357 358L346 356L347 374Q347 394 348 396V399H355Q366 396 535 396Q663 396 689 398L703 399Q703 398 702 375T700 351L688 353Q655 356 601 357Q553 357 553 355Q562 332 562 294Q562 280 561 267T555 241T548 218T539 195T529 175T518 156T508 141T497 126L489 115L496 107Q549 54 596 54Q623 54 644 67T677 101T697 140T708 174L710 187Q710 188 710 188L711 190Q714 190 723 187T733 183Q733 179 732 172T726 145T714 107T694 66T665 27T623 0T569 -11Q500 -11 443 41L434 49L425 42Q348 -9 275 -9Q251 -9 233 -6Q187 -1 152 18T98 60T67 111T52 159T49 195Q49 231 60 261T96 315T141 354T197 390L208 397Q181 459 181 520ZM374 577Q374 607 356 629T311 651Q289 651 271 636Q242 614 242 559Q242 533 249 502T262 453T270 435T279 440T298 453T314 464Q374 503 374 577ZM127 217Q127 145 173 89T291 32Q318 32 347 42T393 63T409 75Q384 100 325 184T227 351Q223 366 220 366Q215 366 178 338Q127 298 127 217',
    0x27: '69 666Q69 680 79 687T104 695Q112 695 117 694T128 684T134 659L104 438Q104 436 96 436T88 438Q88 447 79 540T69 655V666',
    0x28: '293 737V719Q291 718 285 714T276 708T268 702T258 695T250 686T241 674Q164 570 164 282Q164 -37 230 -119Q273 -171 292 -171Q293 -171 293 -179V-186H289Q270 -180 259 -175Q175 -132 145 -23T114 275Q114 491 157 598T293 737',
    0x29: '223 259Q223 386 212 474T178 609T136 677T89 714V735Q121 726 139 713Q276 622 276 273Q276 98 246 -23Q225 -106 189 -139T89 -187V-170L101 -165Q148 -146 172 -110T210 13T223 259',
    0x2A: '118 573Q118 575 76 602L34 629L50 647L55 652L66 642Q76 633 91 620T117 598L128 590Q128 663 125 687V692H151V689V687Q151 685 151 683T150 678T150 672Q145 628 144 605V592L219 652L232 634Q232 632 220 624Q195 610 155 582L146 575L158 567Q178 552 197 540T225 523T233 516Q233 515 226 506T217 495L152 549L143 555V530Q144 509 145 492T148 466T149 454Q149 449 142 449H125V462Q128 522 128 549V562L115 552Q88 531 59 506L45 495Q44 495 39 505T34 516L118 573',
    0x2B: '357 584L399 598V282H709L702 263L696 243H399V-64L379 -73L358 -82Q357 -82 357 81V243H47L51 253Q52 256 54 263T58 272L62 282H357V584',
    0x2C: '99 62Q99 82 114 94T144 107Q159 107 178 77T205 26Q213 5 213 -23Q213 -49 207 -65T181 -113Q128 -189 122 -191Q121 -191 116 -184T111 -174Q111 -173 122 -155T145 -111T156 -62Q156 -44 152 -34T127 4L104 37Q99 49 99 62',
    0x2D: '46 236L62 274Q62 275 384 275H706L699 255L693 236H46',
    0x2E: '87 43Q87 69 104 85T142 102Q164 102 182 86T200 44Q200 20 183 3T141 -15Q118 -15 103 2T87 43',
    0x2F: '230 270Q426 721 428 721Q437 719 447 717L466 713L448 672Q78 -180 77 -181Q77 -182 55 -182L34 -181L230 270',
    0x30: '212 -13Q184 -13 156 -2T101 32T59 97T42 195Q42 311 132 396Q170 433 211 462T262 492Q272 492 301 477T366 434T429 360T456 258Q456 161 378 74T212 -13ZM381 209Q381 257 365 295T328 355T282 390T243 408T223 413Q220 413 204 403T167 376T137 341Q119 305 119 250Q119 168 159 114T263 59Q308 59 344 93T381 209',
    0x31: '123 459Q145 459 170 460T217 462T256 464T284 466L295 467Q296 467 296 467T297 468Q299 468 302 466T307 462L309 459Q307 454 304 424T299 341T297 235Q297 139 298 101T302 55T313 44Q316 43 367 43L460 46Q460 35 459 22V-1H450Q402 2 281 6Q222 6 171 4T91 1T56 -1L47 -2V43H121H170Q195 43 201 45T209 56Q212 69 212 214Q212 333 209 365T194 409Q183 417 161 423T121 430L104 432Q103 432 103 446V459H123',
    0x32: '104 384Q115 394 133 409T199 449T281 474Q321 474 351 447T385 378Q385 328 333 255T228 127T176 72Q176 67 183 65Q184 65 203 65T260 67T331 69L475 73L484 67Q484 64 472 33L460 1H60V17L107 61Q210 159 249 208Q309 283 309 331Q309 363 285 389T228 415Q212 415 184 403T134 379L114 367L104 384',
    0x33: '305 328Q305 372 279 396T214 421H211Q172 421 128 384L107 398L116 405Q151 437 191 455T251 473H260Q314 473 341 455T382 394Q384 386 384 367T382 338Q362 263 271 217L256 210L257 206L259 202Q260 202 272 201T296 198T324 192T355 179T384 157T410 123T427 75Q429 64 429 41Q429 -59 353 -120T183 -182L88 -164Q81 -162 69 -157T48 -147T39 -141Q39 -139 46 -127L53 -114L69 -122Q129 -149 171 -149Q218 -149 253 -131T305 -83T330 -26T338 29Q338 41 336 55T328 89T308 127T273 153Q228 171 162 171Q158 171 152 171T142 170H127V204H134Q232 214 275 257Q305 292 305 328',
    0x34: '299 -179Q306 -156 306 -48V0H11V7Q10 10 10 18Q10 23 154 236L298 449Q298 450 339 463L379 476Q385 473 384 470V466Q384 463 384 457T384 444T383 427T383 408Q381 328 381 248Q381 46 384 40H387Q422 40 460 44Q465 44 470 44T478 44L481 45Q481 43 478 24T473 1Q473 -1 464 -1Q462 -1 451 -1T430 0H387V-76L389 -156V-161L311 -191Q299 -181 299 -179ZM299 364H287L277 352Q234 297 186 224T112 104T79 43Q79 42 192 42H306V115Q306 300 299 359V364',
    0x35: '334 25Q334 99 296 134T207 169Q154 169 107 123L98 114L89 120L80 125V458H420Q420 456 409 418L397 379Q397 378 264 378H131Q130 377 128 376T125 374T124 371T122 368T122 363T121 356T121 345V279V190L130 186L140 190Q196 214 260 214Q311 214 348 197T404 153T431 99T440 42T433 -16T406 -76T356 -130T276 -169T163 -184H156Q110 -184 57 -163L47 -159L53 -147L58 -134Q61 -134 74 -139T110 -148T156 -153Q206 -153 243 -135T299 -87T326 -30T334 25',
    0x36: '45 240Q45 328 73 406T143 536T235 626T327 681T399 699Q400 699 404 699T411 700Q424 700 441 696T459 689Q459 671 451 637Q451 633 447 632L444 629L434 633Q413 640 384 640H377Q299 640 222 565Q182 531 156 463T129 315V306H136L149 315Q229 376 316 376H318Q393 376 432 326T471 213Q471 129 402 58T237 -13T93 59T45 240ZM391 172Q391 231 354 272T258 314Q230 314 200 302T154 279T133 262L134 249Q154 32 266 32Q315 32 353 64T391 172',
    0x37: '395 377L391 382H225Q59 382 59 383L74 423Q89 464 89 465Q90 468 94 468Q146 460 350 458H498V442L473 406Q241 75 125 -156L113 -181H40L37 -168L57 -140Q115 -58 199 70T339 287T395 377',
    0x38: '220 -10Q168 -10 131 6T75 50T48 103T40 157Q40 223 77 266Q103 295 156 328T225 375Q247 393 247 394L206 361Q205 361 193 368T164 391T131 426T102 474T90 531Q90 580 114 615Q146 660 238 698L254 705L262 704Q288 704 332 693T402 656Q434 620 434 568Q434 518 401 475T321 402L305 391L336 368Q339 366 353 356T372 343T389 330T406 316T420 301T434 283T445 265T454 244T458 222T461 195Q461 106 389 48T220 -10ZM350 545Q350 578 337 601T304 634T266 649T234 653L224 654L204 639Q196 634 191 629T182 621T176 614T173 609T170 603T168 597Q165 585 165 567Q165 497 261 424L273 415Q350 467 350 545ZM261 405L263 407Q262 407 261 405ZM258 403Q257 403 255 401L254 399L256 400Q258 402 258 403ZM252 398Q251 398 249 396L248 394L250 395Q252 397 252 398ZM245 36Q276 36 300 45T338 69T360 102T371 136T374 168Q374 211 341 255Q324 275 305 289T235 332Q231 330 215 321T193 307T173 292T153 271T138 247T127 216T123 177Q123 146 132 117T170 62T245 36',
    0x39: '353 93T352 93T320 79T251 49T201 34Q127 37 87 79Q28 138 28 234Q28 273 37 304T60 355T101 396T152 429T218 462L234 469H243Q348 461 395 417Q466 348 466 201Q466 72 397 -29T211 -163Q155 -179 91 -182H72V-154H80Q144 -154 202 -131T297 -60Q318 -31 333 7T352 68L357 92Q353 93 352 93ZM369 208Q369 240 362 272T339 339T290 394T214 415Q171 415 144 372T116 266Q116 193 154 144T238 95H249Q369 95 369 208',
    0x3A: '50 377T50 400T64 440T99 457Q128 457 146 440T165 399Q165 375 146 359T102 342T64 359ZM53 19T53 43T66 86T103 105Q129 105 148 87T168 41Q168 17 147 3T102 -12Q80 -12 67 3',
    0x3B: '47 399Q47 424 62 441T101 458T143 442T162 400T144 359T101 343Q78 343 63 360T47 399ZM76 86Q76 88 80 91T91 96T106 99Q119 99 131 86Q179 35 179 -25Q179 -64 146 -115T89 -189Q86 -187 83 -185T79 -182T76 -180T75 -177T77 -173T80 -168Q121 -108 121 -64Q121 -44 94 -5T66 52Q66 66 71 75T76 86',
    0x3D: '725 366Q724 365 721 349T716 331V329H385Q54 329 54 331Q55 332 59 349T63 368H394Q725 368 725 366ZM725 169Q724 168 721 152T716 134V132H385Q54 132 54 134Q55 135 59 152T63 171H394Q725 171 725 169',
    0x3F: '46 557Q46 613 103 653T227 693Q287 693 322 659T357 564Q357 517 326 469T259 390T191 326T160 272Q160 240 187 221Q193 217 193 216Q182 209 170 200L147 184Q127 192 113 209T98 250Q98 290 193 376Q287 454 287 542Q287 581 262 616T188 652Q143 652 126 631T108 588Q108 559 140 527L79 490Q46 515 46 557ZM108 47Q108 68 123 85T160 103Q179 103 198 90T217 46Q215 24 201 7T164 -11Q142 -11 125 6T108 47',
    0x5B: '262 -119Q224 -120 191 -123T141 -128T118 -130Q117 -130 117 305V740H122Q141 737 219 736H278V723Q278 711 277 711L159 699V-93H162Q167 -93 220 -96T276 -100Q278 -100 278 -109V-119H262',
    0x5D: '64 733Q89 733 110 734T143 737T158 738H160V-131H154Q101 -125 40 -124H-4V-103H1Q3 -102 57 -98T113 -92H118V700L64 703Q7 707 3 708H-4V732H21Q34 733 64 733',
    0x5E: '0 464L250 734L262 722Q274 712 384 598L495 486Q483 478 467 467L456 459L248 672L154 580L23 452Q17 454 10 458T0 464',
    0x2018: '117 410Q97 410 71 455T45 539Q45 588 129 694L140 708Q142 708 153 694L147 682Q106 609 106 582V577V571Q106 548 132 511T158 455Q158 434 143 422T117 410',
    0x2019: '105 529Q105 546 77 588T49 651Q49 658 51 666Q53 672 67 682T92 692Q111 692 137 644T163 563Q163 534 143 497T99 428T74 395Q72 395 65 400T58 407Q105 476 105 523V529',
    0x2044: '230 270Q426 721 428 721Q437 719 447 717L466 713L448 672Q78 -180 77 -181Q77 -182 55 -182L34 -181L230 270',
    0xE300: '427 436Q427 434 427 425T429 398T430 362Q430 222 396 109L393 99L305 33Q218 -32 216 -32Q208 -29 142 22L91 68L78 81L77 94Q75 130 75 173Q75 245 87 347L135 385Q178 418 184 424L177 428Q174 429 170 431Q116 454 96 473T75 534Q79 608 154 683Q164 677 164 673Q164 670 157 662T144 637T137 598Q137 552 182 518T280 470T380 447T427 436ZM342 371L275 394L208 417Q203 417 192 399T168 334T156 229Q153 187 153 157Q153 141 156 135Q158 125 208 88T280 51Q306 51 326 120T346 297Q346 339 344 354T342 371',
    0xE301: '39 551L35 569L52 577Q72 586 98 595T140 610T158 616Q174 612 200 604T293 560T412 477Q414 475 417 472Q428 462 430 450T432 376Q432 223 401 124Q395 106 393 103T382 92Q351 68 281 20T206 -29Q201 -31 137 26L100 60L78 83L77 112Q76 132 76 170Q76 259 86 342L88 360L101 371Q116 386 163 422T215 459Q216 459 224 455T233 450L229 446Q225 442 218 434T203 419Q179 394 175 389T168 372Q156 334 156 262Q156 167 164 137Q168 125 196 102T252 62L278 45Q279 45 285 52T302 78T322 126T339 205T346 316Q346 367 344 389L343 406L326 423Q228 520 113 559L100 564L70 557L39 551',
    0xE302: '123 386L120 431Q116 476 116 511V520Q116 593 174 649Q207 680 236 680Q258 680 284 664T312 648Q318 648 327 656Q328 657 330 659Q337 664 337 661Q337 660 338 657Q338 652 339 648L268 566L260 574Q234 600 206 600Q182 600 164 585T145 541Q145 492 211 386L267 385H324L299 354H214V312Q214 86 193 -58L192 -69L116 -215H108Q92 -215 92 -212Q93 -211 100 -189T116 -135T128 -80Q134 -41 134 22Q134 54 130 185T125 349V354H29L59 385H91Q123 385 123 386',
    0xE303: '91 530Q91 564 116 600T164 656T194 678Q195 678 200 678T209 679Q268 679 316 639L293 593Q267 547 263 546H262Q260 546 256 553Q222 613 180 613Q160 613 146 599T132 564T170 474T210 388H318L296 356H206V322Q204 284 204 255Q202 221 202 161V99Q202 28 194 -22T160 -124Q148 -146 116 -199L101 -224L91 -220Q85 -218 84 -217T83 -215L101 -161Q116 -114 119 -73T122 108Q119 334 117 352V356H72L28 357L66 388H92Q118 388 118 389L109 433Q91 514 91 530',
    0xE304: '254 -150Q293 -150 328 -126T363 -54Q363 -38 352 29T339 98L250 34Q160 -30 159 -30L77 64V71Q74 95 74 174Q74 212 75 243T79 294T83 328T87 352T90 366L117 384Q206 446 238 464L250 471Q277 455 306 443T350 427L365 423Q367 423 405 443T443 465L449 455Q431 414 426 362T418 201Q418 135 420 121Q438 -4 438 -19Q438 -26 438 -31T434 -42T429 -51T420 -63T408 -77T391 -95T370 -119T346 -147T325 -170T309 -187T291 -200T274 -207T252 -213T225 -214Q175 -214 132 -196T70 -160L52 -143Q52 -138 90 -48Q90 -47 95 -47H101Q108 -81 146 -115T254 -150ZM341 136Q341 157 344 242T347 348V355L334 356Q299 359 262 367T203 383T179 391Q177 391 173 377T163 323T158 227Q158 164 161 128V121L174 106Q203 75 223 59L341 127V136',
    0xE305: '92 446Q92 603 82 664Q94 670 95 670L96 666Q98 661 101 651T108 633Q121 598 121 597L141 612Q247 686 250 686Q251 686 266 679Q261 674 243 659T213 632T190 597T173 546Q172 541 171 530T170 511T170 502Q171 502 222 542L273 582Q308 522 315 504L279 449L269 462Q231 506 215 506Q202 506 190 490Q164 458 164 395V390H279L266 373L254 355H167V306Q169 252 169 217Q170 195 170 147V117L200 92Q234 64 237 64Q243 64 277 81L311 99V75Q310 75 242 27L174 -20L156 -3Q88 60 81 60L79 62Q80 60 82 62Q87 67 87 290V355H57L26 356L73 390H92V446',
    0xE306: '117 531Q117 533 137 544T178 566L198 577Q200 577 204 575T208 572V570Q208 568 208 566T207 560Q197 496 197 397V392H321L295 353H199V260Q199 157 200 145V122L269 68Q271 67 274 67Q282 67 310 83T342 100Q343 100 345 92T346 83L211 -21L172 12Q117 59 117 63Q117 65 117 87T119 150T120 238V353H75L29 354L65 391H118V460Q117 498 117 531',
    0xE307: '337 91V78L324 71Q288 53 256 29T206 -8T180 -22Q174 -22 158 -9Q82 46 60 46H59L63 51Q67 56 73 68T85 96Q101 158 101 254Q101 300 95 330T83 370T66 394L53 388Q48 385 41 382T24 374Q22 376 20 378T16 381T13 383T10 385V386L119 475Q150 439 160 430L171 422V409Q173 377 173 300Q173 228 166 183T152 122T145 102Q207 81 242 58L337 104V111Q340 146 340 227Q340 320 339 351T338 408V423L422 469Q425 465 429 462L426 438Q413 354 413 251Q413 152 423 119Q426 110 435 96T452 82Q454 82 509 103Q514 98 514 89Q514 87 507 81T472 51T409 -7L395 -20Q393 -18 390 -17Q386 -14 382 -6Q380 -2 379 1Q369 24 361 40T348 62T341 73T338 84L337 91',
},{
});
