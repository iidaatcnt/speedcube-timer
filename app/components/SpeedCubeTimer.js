'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';

const SpeedCubeTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [times, setTimes] = useState([]);
  const [currentSession, setCurrentSession] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // タイマーの更新
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // ao5の計算
  const calculateAo5 = useCallback((timeArray) => {
    if (timeArray.length < 5) return null;
    
    const lastFive = timeArray.slice(-5);
    const sorted = [...lastFive].sort((a, b) => a - b);
    // 最速と最遅を除いた3つの平均
    const middle3 = sorted.slice(1, 4);
    return middle3.reduce((sum, time) => sum + time, 0) / 3;
  }, []);

  // 時間のフォーマット
  const formatTime = useCallback((ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  // タイマー開始/停止
  const handleTimerToggle = useCallback(() => {
    if (isRunning) {
      // 停止
      setIsRunning(false);
      const finalTime = Date.now() - startTimeRef.current;
      const newTimes = [...times, finalTime];
      setTimes(newTimes);
      setCurrentSession([...currentSession, finalTime]);
      setTime(finalTime);
    } else if (isReady) {
      // 開始
      setIsRunning(true);
      setIsReady(false);
      startTimeRef.current = Date.now();
      setTime(0);
    } else {
      // 準備状態へ
      setIsReady(true);
      setTime(0);
    }
  }, [isRunning, isReady, times, currentSession]);

  // キーボードイベント
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isRunning && !isReady) {
          setIsReady(true);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleTimerToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleTimerToggle, isRunning, isReady]);

  // リセット
  const handleReset = () => {
    setIsRunning(false);
    setIsReady(false);
    setTime(0);
    setCurrentSession([]);
  };

  // 全履歴クリア
  const handleClearAll = () => {
    setTimes([]);
    handleReset();
  };

  // 最後のタイムを削除
  const handleDeleteLast = () => {
    if (times.length > 0) {
      const newTimes = times.slice(0, -1);
      setTimes(newTimes);
      if (currentSession.length > 0) {
        setCurrentSession(currentSession.slice(0, -1));
      }
    }
  };

  const currentAo5 = calculateAo5(times);
  const sessionAo5 = calculateAo5(currentSession);

  // 状態に応じた表示色
  const getTimerColor = () => {
    if (isRunning) return 'text-green-500';
    if (isReady) return 'text-yellow-500';
    return 'text-blue-600';
  };

  const getStatusText = () => {
    if (isRunning) return 'ストップするにはスペースを離す';
    if (isReady) return 'スタートするにはスペースを離す';
    return 'スペースを押して準備';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          スピードキューブタイマー
        </h1>

        {/* メインタイマー */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div 
            className={`text-6xl md:text-8xl font-mono text-center mb-4 transition-colors cursor-pointer ${getTimerColor()}`}
            onClick={handleTimerToggle}
          >
            {formatTime(time)}
          </div>
          
          <div className="text-center text-gray-600 mb-4">
            {getStatusText()}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
              disabled={isRunning}
            >
              セッションリセット
            </button>
            <button
              onClick={handleDeleteLast}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              disabled={isRunning || times.length === 0}
            >
              最後のタイムを削除
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              disabled={isRunning}
            >
              全履歴クリア
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 統計情報 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">統計情報</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">現在のao5:</span>
                <span className="text-lg font-mono text-blue-600">
                  {currentAo5 ? formatTime(currentAo5) : '—'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">セッションao5:</span>
                <span className="text-lg font-mono text-green-600">
                  {sessionAo5 ? formatTime(sessionAo5) : '—'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">セッション回数:</span>
                <span className="text-lg font-mono">{currentSession.length}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">総計測回数:</span>
                <span className="text-lg font-mono">{times.length}</span>
              </div>
            </div>
          </div>

          {/* タイム履歴 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              最近のタイム (最新{Math.min(times.length, 10)}回)
            </h2>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {times.length === 0 ? (
                <p className="text-gray-500 text-center py-4">まだタイムがありません</p>
              ) : (
                times.slice(-10).reverse().map((time, index) => {
                  const actualIndex = times.length - index;
                  return (
                    <div 
                      key={`${time}-${actualIndex}`}
                      className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-600">#{actualIndex}</span>
                      <span className="font-mono text-lg">{formatTime(time)}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 使い方 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">使い方</h2>
          <div className="text-gray-600 space-y-2">
            <p>• <strong>スペースキー</strong>を押すと準備状態（黄色）になります</p>
            <p>• <strong>スペースキー</strong>を離すとタイマーが開始（緑色）されます</p>
            <p>• タイマー実行中に<strong>スペースキー</strong>を離すと停止し、タイムが記録されます</p>
            <p>• <strong>ao5</strong>: 直近5回のタイムから最速・最遅を除いた3回の平均値</p>
            <p>• モバイルの場合、タイマー部分をタップしても操作できます</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedCubeTimer;