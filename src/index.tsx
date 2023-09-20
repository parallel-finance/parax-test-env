import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import relateTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import 'react-toastify/dist/ReactToastify.css';

import { ParaX } from './apps/parax';

dayjs.extend(utc);
dayjs.extend(relateTime);

ReactDOM.render(<ParaX />, document.getElementById('root'));
