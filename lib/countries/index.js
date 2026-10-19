import ar from './ar.js';
import bo from './bo.js';
import br from './br.js';
import cl from './cl.js';
import co from './co.js';
import ec from './ec.js';
import gy from './gy.js';
import pe from './pe.js';
import py from './py.js';
import sr from './sr.js';
import uy from './uy.js';
import ve from './ve.js';

// Para adicionar um país, crie o módulo nesta pasta e registre-o aqui.
export const COUNTRIES = [ar, bo, br, cl, co, ec, gy, pe, py, sr, uy, ve];

export const DEFAULT_COUNTRY = 'BR';

export const getCountry = (code) => COUNTRIES.find((c) => c.code === code) ?? COUNTRIES.find((c) => c.code === DEFAULT_COUNTRY);
