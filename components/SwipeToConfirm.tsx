import React, {
  useRef,
  useEffect,
  useState,
  ReactNode,
  useReducer,
} from "react";
import { View, PanResponder, Animated, Easing } from "react-native";
import "nativewind";

export enum Status {
  Initial = 1,
  Moving = 2,
  Verifying = 3,
  Confirmed = 4,
  Failed = 5,
}

interface Props {
  containerStyle?: string;
  renderSlider?: (status: Status) => JSX.Element;
  threshold?: number;
  onSwipeStart?: () => void;
  onConfirm?: <T>() => Promise<T> | void;
  children?: ReactNode;
  onStatusChange?: (status: Status) => void;
}

const initialState = {
  status: Status.Initial,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "UpdateStatus":
      return {
        ...state,
        status: action.payload,
      };
    default:
      return state;
  }
};

export default (props: Props) => {
  const {
    containerStyle,
    onSwipeStart,
    onConfirm,
    renderSlider,
    children,
    threshold = 0.5,
    onStatusChange,
  } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  const setStatus = (s: Status) => {
    dispatch({
      type: "UpdateStatus",
      payload: s,
    });
  };

  const containerWidthRef = useRef(0);
  const sliderWrapperWidthRef = useRef(0);
  const onSwipeStartRef = useRef(onSwipeStart);
  const onConfirmRef = useRef(onConfirm);
  const moveX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state.status !== stateRef.current.status) {
      onStatusChange && onStatusChange(state.status);
    }
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    onSwipeStartRef.current = onSwipeStart;
  }, [onSwipeStart]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (
          [Status.Confirmed, Status.Verifying].includes(stateRef.current.status)
        ) {
          return;
        }
        if (onSwipeStartRef.current) {
          onSwipeStartRef.current();
        }
        moveX.stopAnimation();
        setStatus(Status.Initial);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (
          [Status.Confirmed, Status.Verifying].includes(stateRef.current.status)
        ) {
          return;
        }
        setStatus(Status.Moving);
        let dx = Math.min(
          containerWidthRef.current - sliderWrapperWidthRef.current,
          gestureState.dx,
        );
        dx = Math.max(0, dx);
        moveX.setOffset(dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (
          [Status.Confirmed, Status.Verifying].includes(stateRef.current.status)
        ) {
          return;
        }
        moveX.stopAnimation();
        moveX.flattenOffset();
        if (gestureState.dx / containerWidthRef.current >= threshold) {
          if (onConfirmRef.current) {
            const confirmResult = onConfirmRef.current();
            if (confirmResult && typeof confirmResult.then === "function") {
              setStatus(Status.Verifying);
              confirmResult
                .then(() => setStatus(Status.Confirmed))
                .catch(() => setStatus(Status.Failed));
            }
          } else {
            setStatus(Status.Confirmed);
          }
        } else {
          setStatus(Status.Initial);
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (state.status === Status.Moving) {
      return;
    }
    Animated.timing(moveX, {
      toValue: [Status.Confirmed, Status.Verifying].includes(state.status)
        ? containerWidthRef.current - sliderWrapperWidthRef.current
        : 0,
      duration: 400,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [state.status]);

  return (
    <View
      className={`w-full h-12 bg-blue-500 relative justify-center items-center mb-3 rounded-full ${containerStyle}`}
      onLayout={(event) =>
        (containerWidthRef.current = event.nativeEvent.layout.width)
      }
    >
      {children}
      <Animated.View
        className="absolute left-0 top-0"
        style={{ transform: [{ translateX: moveX }] }}
        onLayout={(event) => {
          sliderWrapperWidthRef.current = event.nativeEvent.layout.width;
        }}
        {...panResponder.panHandlers}
      >
        {renderSlider ? (
          renderSlider(state.status)
        ) : (
          <View className="h-10 w-10 p-1 bg-white rounded-full" />
        )}
      </Animated.View>
    </View>
  );
};
