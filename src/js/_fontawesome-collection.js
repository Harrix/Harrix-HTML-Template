import { library, dom } from '@fortawesome/fontawesome-svg-core'

import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faFileArchive } from '@fortawesome/free-solid-svg-icons/faFileArchive';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';

library.add(
    faSearch,
    faFileArchive,
    faDownload,
    faGithub,
);

var faHarrix = {
    prefix: 'fah',
    iconName: 'harrix',
    icon: [512, 512, [], "e000", "M441.3 210.8C460.6 289 428 371.2 361 415.2l-62.2-142.6-59.6 25.9L301 441.1c-78.1 19.3-160.3-13.3-204.4-80.4L36.2 387C101 496.3 238.4 542.6 358 490.8s179.2-184 143.7-305.9l-60.4 25.9zM154 21.2C34.7 73.1-25.2 205.3 10.3 327.1l60.4-26.3C51.8 223 84 140.5 151.4 96.4L213.2 239l59.6-25.9L211 70.5c78.1-19.3 160.3 13.3 204.4 80.4l60.4-26.3C410.9 15.7 273.6-30.6 154 21.2z"]
};

var faClose = {
    prefix: 'fah',
    iconName: 'close',
    icon: [512, 512, [], "e001", "M295.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L256 216.4 125.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L216.4 256 86.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L256 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L295.6 256z"]
};

library.add(
    faClose,
    faHarrix
);

dom.watch()