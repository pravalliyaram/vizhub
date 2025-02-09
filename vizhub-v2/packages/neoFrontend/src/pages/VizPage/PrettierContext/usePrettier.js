import { useCallback, useEffect, useContext, useState, useRef } from 'react';
import {
  getVizFileIndex,
  getVizFile,
  getExtension,
  fileChangeOp,
} from 'vizhub-presenters';
import { RealtimeModulesContext } from '../../../RealtimeModulesContext';
import { VizContext } from '../VizContext';
import { URLStateContext } from '../URLStateContext';

const parsers = {
  '.js': 'babel',
  '.css': 'css',
  '.html': 'html',
  '.md': 'markdown',
  '.json': 'json',
};

export const usePrettier = () => {
  const { viz$, submitVizContentOp } = useContext(VizContext);
  const realtimeModules = useContext(RealtimeModulesContext);
  const { activeFile } = useContext(URLStateContext);
  const [prettierError, setPrettierError] = useState(null);
  const subscribersRef = useRef(new Set());

  const subscribe = useCallback(
    (subscriber) => {
      subscribersRef.current.add(subscriber);
    },
    [subscribersRef]
  );

  const unsubscribe = useCallback(
    (subscriber) => {
      subscribersRef.current.delete(subscriber);
    },
    [subscribersRef]
  );

  const prettify = useCallback(() => {
    if (!realtimeModules) {
      console.log('Realtime modules not yet loaded.');
      return;
    }
    if (activeFile) {
      import('./prettierModules').then((prettierModules) => {
        const { prettier, plugins } = prettierModules;

        const viz = viz$.getValue();
        const fileIndex = getVizFileIndex(activeFile)(viz);
        const file = getVizFile(fileIndex)(viz);
        const extension = getExtension(file.name);
        const parser = parsers[extension];

        if (!parser) {
          console.log('No Prettier parser for extension ' + extension);
          return;
        }

        const oldText = file.text;

        try {
          setPrettierError(null);
          const newText = prettier.format(oldText, {
            parser,
            plugins,
            singleQuote: true,
            printWidth: 60,
          });

          const op = fileChangeOp(fileIndex, oldText, newText, realtimeModules);
          submitVizContentOp(op);
          subscribersRef.current.forEach((subscriber) => subscriber());
        } catch (error) {
          setPrettierError(error);
        }
      });
    }
  }, [activeFile, viz$, realtimeModules, submitVizContentOp]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey && event.code === 'KeyP') {
        prettify();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [prettify]);

  return {
    prettify,
    prettierError,
    subscribe,
    unsubscribe,
  };
};
