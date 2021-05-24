import { useIntl } from 'react-intl';

const useTranslate = (root) => {
  const { messages } = useIntl();
  const translate = messages[root];

  const t = (child) => {
    function getTranslate(o, target) {
      // target = target.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      // target = target.replace(/^\./, ''); // strip a leading dot
      let a = target.split('.');
      for (let i = 0; i < a.length; ++i) {
        let k = a[i];
        // console.log(k in o);
        if (k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    }
    if (/./g.test(child)) {
      return getTranslate(translate, child);
    }

    return translate[child];
  };

  return { t, translate };
};

export default useTranslate;
