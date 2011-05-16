var data = [
	{
		Title: "TSCC - Smallest",
		WatchmenSize: 4519,
		WatchmenFPS: 3.6,
		ToyStorySize: 3014,
		ToyStoryFPS: 11.9,
		ScreenFPS: 25.8,
		ScreenSize: 915,
		LectureFPS: 90.2,
		LectureSize: 246
	},
	{
		Title: "TSCC - Default",
		WatchmenSize: 4630,
		WatchmenFPS: 7.3,
		ToyStorySize: 3039,
		ToyStoryFPS: 13.4,
		ScreenFPS: 46.5,
		ScreenSize: 928,
		LectureFPS: 94.8,
		LectureSize: 248
	},
	{
		Title: "TSCC - Fastest",
		WatchmenSize: 5102,
		WatchmenFPS: 11.4,
		ToyStorySize: 3167,
		ToyStoryFPS: 24.4,
		ScreenFPS: 72.2,
		ScreenSize: 976,
		LectureFPS: 106.1,
		LectureSize: 273
	},
	{
		Title: "Yeti 0.5",
		WatchmenSize: 1427,
		WatchmenFPS: 39.3,
		ToyStorySize: 812,
		ToyStoryFPS: 64.2,
		ScreenFPS: 92.5,
		ScreenSize: 329,
		LectureFPS: 418.8,
		LectureSize: 67
	},
	{
		Title: "VP8 0.96.1 - Highest quality",
		WatchmenSize: 489,
		WatchmenFPS: 12.4,
		ToyStorySize: 259,
		ToyStoryFPS: 21.1,
		ScreenFPS: 48.4,
		ScreenSize: 70,
		LectureFPS: 83.3,
		LectureSize: 65
	},
	{
		Title: "TSC2 - Highest quality",
		WatchmenSize: 826,
		WatchmenFPS: 27.7,
		ToyStorySize: 687,
		ToyStoryFPS: 54.5,
		ScreenFPS: 96.9,
		ScreenSize: 295,
		LectureFPS: 456.3,
		LectureSize: 86
	},
	{
		Title: "TSC2 - Default quality",
		WatchmenSize: 420,
		WatchmenFPS: 32.8,
		ToyStorySize: 369,
		ToyStoryFPS: 62,
		ScreenFPS: 96.9,
		ScreenSize: 213,
		LectureFPS: 456.3,
		LectureSize: 83
	},
	{
		Title: "TSC2 - Lowest quality",
		WatchmenSize: 266,
		WatchmenFPS: 34.4,
		ToyStorySize: 217,
		ToyStoryFPS: 67.8,
		ScreenFPS: 94.7,
		ScreenSize: 107,
		LectureFPS: 456.3,
		LectureSize: 33
	},
	{
		Title: "Huffyuv 2.1.1",
		WatchmenSize: 2992,
		WatchmenFPS: 30,
		ToyStorySize: 1973,
		ToyStoryFPS: 76.5,
		ScreenFPS: 86.8,
		ScreenSize: 1620,
		LectureFPS: 213.8,
		LectureSize: 9293
	},
	{
		Title: "FastCodec 1.0",
		WatchmenSize: 2308,
		WatchmenFPS: 36.5,
		ToyStorySize: 1761,
		ToyStoryFPS: 61,
		ScreenFPS: 94.8,
		ScreenSize: 1287,
		LectureFPS: 146.3,
		LectureSize: 5713
	},
	{
		Title: "x264 - Lossless",
		WatchmenSize: 1459,
		WatchmenFPS: 32.8,
		ToyStorySize: 742,
		ToyStoryFPS: 70.5,
		ScreenFPS: 94.7,
		ScreenSize: 233,
		LectureFPS: 265.9,
		LectureSize: 113
	},
	{
		Title: "x264 - Ultra high quality",
		WatchmenSize: 1123,
		WatchmenFPS: 44.7,
		ToyStorySize: 587,
		ToyStoryFPS: 81.7,
		ScreenFPS: 96.9,
		ScreenSize: 198,
		LectureFPS: 205.2,
		LectureSize: 91
	},
	{
		Title: "x264 - High quality",
		WatchmenSize: 339,
		WatchmenFPS: 35.4,
		ToyStorySize: 173,
		ToyStoryFPS: 76.5,
		ScreenFPS: 99.2,
		ScreenSize: 42,
		LectureFPS: 285.7,
		LectureSize: 42
	},
	/*{
		Title: "x264 - Medium quality",
		WatchmenSize: 116,
		WatchmenFPS: 35.4,
		ToyStorySize: 67,
		ToyStoryFPS: 89.9,
		ScreenFPS: 99.2,
		ScreenSize: 19,
		LectureFPS: 285.7,
		LectureSize: 25
	},*/
	{
		Title: "DivX 6.9.2 - Highest quality",
		WatchmenSize: 366,
		WatchmenFPS: 9.3,
		ToyStorySize: 245,
		ToyStoryFPS: 11.9,
		ScreenFPS: 28.1,
		ScreenSize: 62,
		LectureFPS: 81.3,
		LectureSize: 67
	},
	{
		Title: "Lagarith 1.3.25",
		WatchmenSize: 1400,
		WatchmenFPS: 43.6,
		ToyStorySize: 1024,
		ToyStoryFPS: 69.1,
		ScreenFPS: 90.5,
		ScreenSize: 732,
		LectureFPS: 545.9,
		LectureSize: 237
	},
	{
		Title: "Xvid 1.3.1 - Highest quality",
		WatchmenSize: 553,
		WatchmenFPS: 18.9,
		ToyStorySize: 288,
		ToyStoryFPS: 35.6,
		ScreenFPS: 63.1,
		ScreenSize: 104,
		LectureFPS: 194.7,
		LectureSize: 113
	},
	{
		Title: "MJPEG - Ultra high quality",
		WatchmenSize: 585,
		WatchmenFPS: 44.2,
		ToyStorySize: 560,
		ToyStoryFPS: 78.1,
		ScreenFPS: 99.1,
		ScreenSize: 561,
		LectureFPS: 205.2,
		LectureSize: 2763
	},
	{
		Title: "MJPEG - High quality",
		WatchmenSize: 252,
		WatchmenFPS: 47,
		ToyStorySize: 266,
		ToyStoryFPS: 99.8,
		ScreenFPS: 99.2,
		ScreenSize: 266,
		LectureFPS: 182,
		LectureSize: 1387
	}
];