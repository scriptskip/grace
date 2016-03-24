var game =
{
	audio:
	{
		load: function ()
		{
			var action = new Audio ();
				action.loop = false;
				action.volume = 1;

			var background = new Audio ();
				background.loop = true;
				background.volume = 0.02;

			var run = function (audio)
			{
				this.src = audio.src || this.src;
				this.loop = audio.loop || this.loop;
				this.volume = audio.volume * game.option.audio.volume || this.volume * game.option.audio.volume;
				this.play ();
			};

			action.run = run;
			background.run = run;

			game.audio.action = action;
			game.audio.background = background;
		}
	},

	canvas:
	{
		load: function ()
		{
			var canvas = window.document.createElement ('canvas');
					canvas.context = canvas.getContext ('2d');
					canvas.font = { face: 'Arial', size: '1em' };
					canvas.redraw = true;
					canvas.scene = [];
					canvas.style.position = 'absolute';
					canvas.z = 0;

			canvas.autosize = function ()
			{
				this.height = window.innerHeight;
				this.width = window.innerWidth;
			};

			canvas.clear = function ()
			{
				canvas.context.clearRect (0, 0, canvas.width, canvas.height);
			};

			canvas.draw =
			{
				set clear (draw)
				{
					for (var id = game.canvas.scene.length; id--;)
					{
						for (var key in draw)
						{
							if (draw[key] == game.canvas.scene[id][key])
							{
								game.canvas.scene.splice (id, 1);
							};
						};
					};
					canvas.redraw = draw.redraw || true;
				},

				type: function (draw)
				{
					var type = 'box';
							type = (draw.a) ? 'line' : type;
							type = (draw.image) ? 'image' : type;
							type = (draw.r) ? 'ring' : type;
							type = (draw.text) ? 'text' : type;
					return type;
				}
			};

			canvas.move = function (move)
			{
				var id = move.id;

			};

			canvas.transform =
			{
				abs: function (x)
				{
					var abs = ((x > 0) && (x <=1)) ? x * canvas.width : x;
					return abs;
				},

				font:
				{
					autosize: function (font)
					{
						var face = font.face;
						var size = canvas.transform.abs (font.width) / font.text.length;
						var text = font.text;

						canvas.context.font = size + 'px ' + face;
						var w = canvas.context.measureText (text).width;

						var width = canvas.transform.abs (font.width);
						while (Math.abs (w - width) > 1)
						{
							size = (w > width) ? 0.9 * size : 1.5 * size;
							canvas.context.font = size + 'px ' + face;
							w = canvas.context.measureText (text).width;
						};
						size = Math.floor (size);
						return size;
					},

					size: function (metric)
					{
						var h = canvas.transform.ord (metric.h);
						var k = metric.k;
						var w = canvas.transform.abs (metric.w);

						h = (k) ? w * k : h;
						return h + 'px';
					}
				},

				h: function (metric)
				{
					var h = canvas.transform.ord (metric.h);
					var k = metric.k;
					var w = canvas.transform.abs (metric.w);

					h = (k) ? w * k : h;
					return h;
				},

				ord: function (y)
				{
					var ord = ((y > 0) && (y <=1)) ? y * canvas.height : y;
					return ord;
				},

				r: function (metric)
				{
					var r = (canvas.width > canvas.height) ? canvas.transform.ord (metric.r) : canvas.transform.abs (metric.r);
					return r;
				},

				w: function (metric)
				{
					var h = canvas.transform.ord (metric.h);
					var k = metric.k;
					var w = canvas.transform.abs (metric.w);

					w = (k) ? h * k : w;
					return w;
				},

				x: function (metric)
				{
					var k = metric.k;
					var w = canvas.transform.abs (metric.w);
					var x = canvas.transform.abs (metric.x);
							x = (k) ? x - k * w : x;
					return x;
				},

				y: function (metric)
				{
					var k = metric.k;
					var h = canvas.transform.ord (metric.h);
					var y = canvas.transform.ord (metric.y);
							y = (k) ? y - k * h : y;
					return y;
				}
			};

			canvas.update = function ()
			{
				switch (game.event.type)
				{
					case 'load':
						canvas.autosize ();
					break;

					case 'resize':
						canvas.autosize ();
						canvas.redraw = true;
					break;
				};
			};

			delete game['canvas'];
			game.canvas = canvas;

			window.document.body.appendChild (canvas);
		}
	},

	data:
	{
		animation: {},
		audio: {},
		image: {},

		set load (data)
		{
			for (var tag in data)
			{
				switch (tag)
				{
					case 'animation':
						for (var id in data[tag])
						{
							var animation = data[tag][id];
								animation.tag = 'animation';
								game.object.id = animation;

								animation.preloop = animation.loop;
								animation.step = 0;
								animation.stop = false;
								animation.time = 0;

							for (var i = animation.frames.length; i--; )
							{
								var image = new Image ();
									image.src = animation.frames[i];
								animation.frames[i] = image;
							};

							animation.clear = function ()
							{
								animation.stop = true;
								game.canvas.draw.clear = { id: animation.tag + animation.id };
							};

							animation.play = function (metric)
							{
								animation.cx = metric.cx;
								animation.cy = metric.cy;
								animation.delay = metric.delay || animation.delay;
								animation.delay = (animation.delays) ? animation.delays[animation.step] : animation.delay;
								animation.h = metric.h || animation.h;
								animation.hw = metric.hw || animation.hw;
								animation.loop = animation.preloop;
								animation.stop = false;
								animation.w = metric.w || animation.w;
								animation.wh = metric.wh || animation.wh;
								animation.x = metric.x;
								animation.y = metric.y;
								animation.z = metric.z || 0;
							};

							animation.show = function (image)
							{
								var cx = animation.cx;
								var cy = animation.cy;
								var h = animation.h;
								var hw = animation.hw;
								var w = animation.w;
								var wh = animation.wh;
								var x = animation.x;
								var y = animation.y;
								var z = animation.z;
								game.canvas.draw.clear = { id: animation.tag + animation.id };
								game.paint = { cx: cx, cy: cy, h: h, hw: hw, id: animation.tag + animation.id, image: image, w: w, wh: wh, x: x, y: y, z: z };
							};

							animation.update = function ()
							{
								switch (game.event.type)
								{
									case 'tick':
										if (animation.stop == false)
										{
											animation.time += game.event.tick;

											if (animation.time / animation.delay > animation.step)
											{
												if (animation.step + 1 <= animation.frames.length)
												{
													animation.delay = (animation.delays) ? animation.delays[animation.step] : animation.delay;
													var image = animation.frames[animation.step];
													animation.show (image);
													animation.step++;

												}
												else
												{
													animation.step = 0;
													animation.time = 0;
													if (typeof (animation.loop) == 'number')
													{
														if (animation.loop - 1 > 0)
														{
															animation.loop--;
														}
														else
														{
															animation.stop = true;
														};
													};
												};
											};
										}
										else
										{

										};
									break;
								};
							};

							game.data.animation[id] = animation;
							game.object.load = animation;
						};
					break;

					case 'audio':
						for (var id in data[tag])
						{
							var audio = data[tag][id];
							game.data.audio[id] = audio;
						};
					break;

					case 'image':
						for (var id in data[tag])
						{
							var image = new Image ();
								image.src = data[tag][id];
							game.data.image[id] = image;
						};
					break;
				};
			};
		}
	},

	draw: function ()
	{
		if (game.canvas.redraw)
		{
			var context = game.canvas.context;
			var z = 0;

			game.canvas.clear ();

			while (z <= game.canvas.z)
			{
				for (var id = game.canvas.scene.length; (id--) && (game.canvas.scene.length > 0);)
				{
					var draw = game.canvas.scene[id];
					if (draw.z == z)
					{
						var r = game.canvas.transform.r ({ r: draw.r });
						var h = game.canvas.transform.h ({ h: draw.h, k: draw.hw, w: draw.w });
						var w = game.canvas.transform.w ({ w: draw.w, k: draw.wh, h: draw.h });

						var a = (draw.type == 'ring') ? draw.a : game.canvas.transform.x ({ x: draw.a, k: draw.cx, w: w || 2 * r });
						var b = (draw.type == 'ring') ? draw.b : game.canvas.transform.y ({ y: draw.b, k: draw.cy, h: h || 2 * r });

						var x = game.canvas.transform.x ({ x: draw.x, k: draw.cx, w: w || 2 * r });
						var y = game.canvas.transform.y ({ y: draw.y, k: draw.cy, h: h || 2 * r });

						var _ = (draw.color) && (draw.fill != false) ? context.fillStyle = draw.color : undefined;
								_ = (draw.color) && (draw.fill != true) ? context.strokeStyle = draw.color : undefined;

								_ = (draw.lw) ? context.lineWidth = draw.lw : undefined;

						switch (draw.type)
						{
							case 'box':
								var _ = (draw.fill != false) ? context.fillRect (x, y, w, h) : context.strokeRect (x, y, w, h);
							break;

							case 'image':
								var _ = (h) ? context.drawImage (draw.image, x, y, w, h) : context.drawImage (draw.image, x, y);
							break;

							case 'line':
								context.beginPath ();
								context.moveTo (a, b);
								context.lineTo (x, y);
								var _ = (draw.fill == true) ? context.fill () : context.stroke ();
							break;

							case 'ring':
								context.beginPath ();
								context.arc (x, y, r, a, b);
								var _ = (draw.fill != false) ? context.fill () : context.stroke ();
							break;

							case 'text':
								if (draw.font)
								{
									var face = draw.font.face || game.canvas.font.face;
									var size = draw.font.size || game.canvas.font.size;
											size = (typeof (draw.font.size) == 'number') ? game.canvas.transform.font.size ({ h: draw.font.size }) : size;

									var align = (draw.font.align) ? context.textAlign = draw.font.align : undefined;
									var baseline = (draw.font.baseline) ? context.textBaseline = draw.font.baseline : undefined;


									var width = (draw.font.width) ? context.font = game.canvas.transform.font.autosize ({ face: face, text: draw.text, width: draw.font.width }) + 'px ' + face : context.font = size + ' ' + face;
								};
								var	_ = (draw.fill != false) ? context.fillText (draw.text, x, y) : context.strokeText (draw.text, x, y);
							break;
						};
					};
				};
				z++;
			};

			game.canvas.redraw = false;
		};
	},

	event:
	{
		block: function () { return false; },

		load: function ()
		{
			game.event.manager (event);

			window.onclick = game.event.manager;
			window.oncontextmenu = game.event.block;
			window.onmousedown = game.event.manager;
			window.onmousemove = game.event.manager;
			window.onmouseup = game.event.manager;
			window.onresize = game.event.manager;
			window.ontick = game.event.manager;
		},

		manager: function (event)
		{
			game.event.tick = event.tick;
			game.event.time = event.time;
			game.event.type = event.type;
			game.event.x = event.x;
			game.event.y = event.y;
			game.event.run ();
		},

		run: function ()
		{
			game.update ();
			game.draw ();
		}
	},

	load: function ()
	{
		game.window.load ();
		game.canvas.load ();
		game.audio.load ();
		game.event.load ();
		game.run ();
	},

	o: {},

	object:
	{
		create:
		{
			asteroid: function (asteroid) {},

			set button (button)
			{
				button.tag = 'button';
				game.object.id = button;

				button.active = button.active || {};
				button.in = undefined;
				button.pressed = button.pressed || {};

				button.animate = function ()
				{
					if (game.object.in (button))
					{
						if (!button.in)
						{
							button.in = true;
							game.canvas.style.cursor = 'pointer';
							button.show ({ color: button.active.color, image: button.active.image });
							var _ = (button.active.in) ? button.active.in () : undefined;
						};
					}
					else
					{
						if (button.in)
						{
							button.in = false;
							game.canvas.style.cursor = 'default';
							button.show ({ color: button.color, image: button.image });
							var _ = (button.active.out) ? button.active.out () : undefined;
						};
					};
				};

				button.click = function ()
				{
					if (game.object.in (button))
					{
						var _ = (button.action) ? button.action () : undefined;
					};
				};

				button.destroy = function ()
				{
					game.object.destroy = button;
					game.canvas.draw.clear = { id: 'button' + button.id };
				};

				button.press = function (press)
				{
					if (game.object.in (button))
					{
						if (press)
						{
							button.show ({ color: button.pressed.color, image: button.pressed.image });
						}
						else
						{
							button.show ({ color: button.color, image: button.image });
						};
						game.canvas.style.cursor = 'default';
					};
				};

				button.show = function (draw)
				{
					var color = draw.color;
					var cx = button.cx;
					var cy = button.cy;
					var font = button.font || {};
							font.width = button.w;
					var h = button.h;
					var hw = button.hw;
					var id = 'button' + button.id;
					var image = draw.image;
					var r = button.r;
					var text = button.text;
					var w = button.w;
					var wh = button.wh;
					var x = button.x;
					var y = button.y;
					var z = button.z;

					button.h = (button.text) ? game.canvas.transform.font.autosize ({ face: font.face, text: button.text, width: font.width }) : button.h;

					game.canvas.draw.clear = { id: id };

					switch (game.canvas.draw.type (button))
					{
						case 'box':
							game.paint = { color: color, cx: cx, cy: cy, h: h, id: id, w: w, x: x, y: y, z: z };
						break;

						case 'image':
							game.paint = { cx: cx, cy: cy, h: h, hw: hw, id: id, image: image, w: w, wh: wh, x: x, y: y, z: z };
						break;

						case 'ring':
							game.paint = { color: color, cx: cx, cy: cy, id: id, r: r, x: x, y: y, z: z };
						break;

						case 'text':
							game.paint = { color: color, font: font, id: id, text: text, x: x, y: y, z: z };
						break;
					};
				},

				button.update = function ()
				{
					switch (game.event.type)
					{
						case 'click':
							button.click ();
						break;

						case 'mousedown':
							button.press (true);
						break;

						case 'mousemove':
							button.animate ();
						break;

						case 'mouseup':
							button.press (false);
						break;
					};
				};

				button.show ({ color: button.color, image: button.image });
				game.object.load = button;
			},

			set comet (comet) {},

			galaxy: function (galaxy)
			{
				galaxy.tag = 'galaxy';
				game.object.id = galaxy;

				galaxy.star = [];

				galaxy.action = function ()
				{
					game.player.galaxy = galaxy;
					game.scene.next = 'galaxy';
				};

				galaxy.create = function ()
				{
					galaxy.name = game.random ('word');
					galaxy.r = game.random (game.option.universe.galaxy.r.min, game.option.universe.galaxy.r.max);
					galaxy.x = game.random (game.option.universe.galaxy.x.min, game.option.universe.galaxy.x.max);
					galaxy.y = game.random (game.option.universe.galaxy.y.min, game.option.universe.galaxy.y.max);

					galaxy.number = game.random (game.option.universe.galaxy.star.number.min, game.option.universe.galaxy.star.number.max, true);
					for (var i = galaxy.number; i--;)
					{
						galaxy.star.push (game.object.create.star ({}));
					};
				};

				galaxy.show = function ()
				{
					for (var i = galaxy.star.length; i--;)
					{
						galaxy.star[i].show ();
					};
				};

				galaxy.update = function ()
				{

				};

				galaxy.create ();
				game.object.load = galaxy;
				return galaxy;
			},

			planet: function (planet)
			{
				game.object.create.satellite ();
			},

			satellite: function (satellite) {},

			star: function (star)
			{
				star.tag = 'star';
				game.object.id = star;

				star.action = function ()
				{

				};

				star.create = function ()
				{
					star.color = game.random ('color');
					star.name = game.random ('word');
					star.r = game.random (game.option.universe.galaxy.star.r.min, game.option.universe.galaxy.star.r.max);
					star.x = game.random (game.option.universe.galaxy.star.x.min, game.option.universe.galaxy.star.x.max);
					star.y = game.random (game.option.universe.galaxy.star.y.min, game.option.universe.galaxy.star.y.max);

					//game.object.create.asteroid ();
					//game.object.create.comet ();
					//game.object.create.planet ();
				};

				star.in = function ()
				{
					var color = star.color;
					var id = 'name' + star.tag + star.id;
					var name = star.name;
					var x = star.x;
					var y = star.y - 2 * star.r;
					game.paint = { color: color, font: { align: 'center' }, id: id, text: name, x: x, y: y }
				};

				star.out = function ()
				{
					var id = 'name' + star.tag + star.id;
					game.canvas.draw.clear = { id: id };
				};

				star.show = function ()
				{
					var color = star.color;
					var id = star.tag + star.id;
					var r = star.r;
					var x = star.x;
					var y = star.y;
					game.object.create.button = { action: star.action, active: { color: color, in: star.in, out: star.out }, color: color, id: id, r: r, redraw: false, x: x, y: y };
				};

				star.update = function () {};

				star.create ();
				game.object.load = star;
				return star;
			},

			start:
			{
				set menu (menu)
				{
					menu.tag = 'menu';
					game.object.id = menu;

					menu.stars = menu.stars || 100;

					menu.action = function ()
					{
						game.data.animation.run.clear ();
						game.audio.action.run ({ src: game.data.audio.run });
						game.audio.background.pause ();
						menu.destroy ();
						game.scene.next = 'universe';
					};

					menu.destroy = function ()
					{
						game.object.destroy = menu;
						game.object.destroy = game.o.button[menu.id];
						game.canvas.draw.clear = { id: 'button' + menu.id };
					};

					menu.in = function ()
					{
						game.data.animation.run.play ({ cx: 0.5, cy: 0.5, h: 0.1, id: 'animate' + menu.id, wh: 2.376, x: 0.5, y: 0.5 });
						game.audio.background.volume = 0.03;
					};

					menu.out = function ()
					{
						game.data.animation.run.clear ();
						game.audio.background.volume = 0.02;
					};

					menu.reshow = function ()
					{
						var w = game.canvas.height * 0.1 * 2.376;
						game.object.destroy = game.o.button[menu.id];
						menu.show ();
					};

					menu.show = function ()
					{
						var w = game.canvas.height * 0.1 * 2.376;
						game.object.create.button = { action: menu.action, active: { image: game.data.image.grace_active, in: menu.in, out: menu.out }, cx: 0.5, cy: 0.5, h: 0.1, image: game.data.image.grace, id: menu.id, pressed: { image: game.data.image.grace_press }, wh: 2.376, w: w, x: 0.5, y: 0.5, z: 1 };
					};

					menu.update = function ()
					{
						switch (game.event.type)
						{
							case 'resize':
								menu.reshow ();
							break;
						};
					};

					game.audio.background.run ({ src: game.data.audio.start });
					game.object.create.start.rain = { n: menu.stars };
					menu.show ();
					game.object.load = menu;
				},

				set rain (rain)
				{
					rain.tag = 'rain';
					game.object.id = rain;

					rain.n = rain.n || 1;
					rain.stars = [];

					rain.create =
					{
						set star (star)
						{
							star.tag = 'star';
							star.id = rain.tag + 'star' + rain.stars.length;

							var pixel = 1 / Math.min (game.canvas.height, game.canvas.width);

							star.color = star.color || game.random ('color');
							star.r = star.r || game.random (0.5 * pixel, 1.5 * pixel);
							star.x = star.x || game.random (0, 1);
							star.y = star.y || game.random (0, 1);

							star.show = function (draw)
							{
								var draw = draw || {};
								var color = star.color;
								var id = star.id;
								var r = star.r;
								var redraw = draw.redraw || false;
								var x = star.x;
								var y = star.y;
								game.canvas.draw.clear = { id: id };
								game.paint = { color: color, id: id, redraw: redraw, r: r, x: x, y: y, z: 0 };
							};

							star.show ();

							rain.stars.push (star);
						},

						set stars  (stars)
						{
							for (var i = rain.n; i--;)
							{
								rain.create.star = {};
							};
						}
					};

					rain.run = function ()
					{
						if (game.random (0, 2, true) == 1)
						{
							for (var i = rain.stars.length - 1; i--; )
							{
								if (game.random (0, 100, true) == 1)
								{
									var star = rain.stars[i];
										star.color = game.random ('color');
										star.show ( {redraw: true } );
								};
							};
						};
					};

					rain.update = function ()
					{
						switch (game.event.type)
						{
							case 'tick':
								rain.run ();
							break;
						};
					};

					rain.create.stars = {};

					game.object.load = rain;
				}
			},

			set universe (universe)
			{
				universe.tag = 'universe';
				game.object.id = universe;

				universe.galaxy = [];

				universe.create = function ()
				{
					universe.number = game.random (game.option.universe.galaxy.number.min, game.option.universe.galaxy.number.max, true);
					for (var i = universe.number; i--;)
					{
						universe.galaxy.push (game.object.create.galaxy ({}));
					};
					game.data.universe = universe;
				};

				universe.show = function ()
				{
					for (var i = universe.galaxy.length; i--;)
					{
						var galaxy = universe.galaxy[i];
						var color = game.option.universe.galaxy.color;
						var id = galaxy.tag + galaxy.id;
						var name = galaxy.name;
						var r = galaxy.r;
						var x = galaxy.x;
						var y = galaxy.y;
						game.object.create.button = { action: galaxy.action, active: {}, color: color, id: id, r: r, x: x, y: y };
						game.paint = { color: color, font: { align: 'center' }, id: 'name' + id, text: name, x: x, y: y - 2 * r };
					};
				};

				universe.update = function ()
				{

				};

				universe.create ();
				universe.show ();
				game.object.load = universe;
			}
		},

		set destroy (object)
		{
			delete game.o[object.tag][object.id];
		},

		set id (object)
		{
			var tag = object.tag;
			var _ = (game.o[tag] == undefined) ? game.o[tag] = {} : undefined;
			object.id = object.id || Object.keys (game.o[tag]).length;
		},

		in: function (object)
		{
			if (object)
			{
				var result;
				var r = game.canvas.transform.r ({ r: object.r });
				var x = game.canvas.transform.x ({ x: object.x, k: object.cx, w: object.w || 2 * r });
				var y = game.canvas.transform.y ({ y: object.y, k: object.cy, h: object.h || 2 * r });
				if (object.r)
				{
					var R = Math.sqrt (Math.pow (game.event.x - x, 2) + Math.pow (game.event.y - y, 2));
					result = (R <= r);
				}
				else
				{
					var h = game.canvas.transform.h ({ h: object.h, k: object.hw, w: object.w });
					var w = game.canvas.transform.w ({ w: object.w, k: object.wh, h: object.h });
					result = ((game.event.x >= x) && (game.event.x <= x + w) && (game.event.y >= y) && (game.event.y <= y + h));
				};
				return result;
			};
		},

		set load (object)
		{
			game.o[object.tag][object.id] = object;
		},

		update: function ()
		{
			for (var tag in game.o)
			{
				for (var id in game.o[tag])
				{
					game.o[tag][id].update ();
				};
			};
		}
	},

	option:
	{
		audio:
		{
			volume: 0
		},

		universe:
		{
			galaxy:
			{
				color: '#fff',
				number: { min: 3, max: 5 },
				r: { min: 0.005, max: 0.01 },
				star:
				{
					number: { min: 100, max: 500 },
					planet:
					{
						number: { min: 0, max: 20 },
						satellite:
						{
							number: { min: 0, max: 10 }
						}
					},
					r: { min: 0.003, max: 0.005 },
					x: { min: 0.01, max: 0.99 },
					y: { min: 0.01, max: 0.99 }
				},
				x: { min: 0.1, max: 0.9 },
				y: { min: 0.1, max: 0.9 },
			}
		}
	},

	set paint (paint)
	{
		paint.id = paint.id || game.canvas.scene.length;

		paint.type = game.canvas.draw.type (paint);

		switch (paint.type)
		{
			case 'ring':
				paint.a = paint.a || 0;
				paint.b = paint.b || 2 * Math.PI;
			break;

			case 'text':
				if (paint.font)
				{
					game.canvas.font.face = paint.font.face || game.canvas.font.face;
					game.canvas.font.size = paint.font.size || game.canvas.font.size;
				};
			break;
		};

		paint.z = paint.z || 0;
		game.canvas.z = (paint.z > game.canvas.z) ? game.canvas.z = paint.z : game.canvas.z;

		game.canvas.scene[game.canvas.scene.length] = paint;
		game.canvas.redraw = paint.redraw || true;
	},

	player: {},

	random: function (min, max, floor)
	{
		var random;
		var type = 'random';
			type = (typeof (min) == 'object') ? 'object' : type;
			type = (Array.isArray (min) == true) ? 'array' : type;
			type = (floor) ? 'floor' : type;
			type = (min == 'color') ? 'color' : type;
			type = (min == 'word') ? 'word' : type;

		switch (type)
		{
			case 'array':
				var r = Math.floor ((Object.keys (min).length) * Math.random ());
				random = min[r];
			break;

			case 'color':
				random = '#' + Math.floor (16777215 * Math.random ()).toString (16);
			break;

			case 'floor':
				random = Math.floor ((max - min + 1) * Math.random ()) + min;
			break;

			case 'object':
				var i = 0;
				var r = Math.floor ((Object.keys (min).length) * Math.random ());
				for (var id in min)
				{
					if (i == r)
					{
						random = min[id];
						break;
					};
					i++;
				};
			break;

			case 'random':
				random = (max - min) * Math.random () + min;
			break;

			case 'word':
				var chars = 'AAAAAAAAAAAAAAAABBBCCCCCDDDDDDDDEEEEEEEEEEEEEEEEEEEEEEEFFFFFGGGGHHHHHHHHHHHHIIIIIIIIIIIIIIJKKLLLLLLLLMMMMMNNNNNNNNNNNNNOOOOOOOOOOOOOOOPPPPQRRRRRRRRRRRRRSSSSSSSSSSSSSTTTTTTTTTTTTTTTTTTTUUUUUUVVWWWWWXYYYYZ';
				var vowels = 'AAAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEEEEEIIIIIIIIIIIIIIOOOOOOOOOOOOOOOUUUUUUYYYY';
				var consonants = 'BBBCCCCCDDDDDDDDFFFFFGGGGHHHHHHHHHHHHJKKLLLLLLLLMMMMMNNNNNNNNNNNNNPPPPQRRRRRRRRRRRRRSSSSSSSSSSSSSTTTTTTTTTTTTTTTTTTTVVWWWWWXZ';
				var coin = Math.random () < 0.5 ? true : false;

				var m = (Math.random() > 0.9) ? 4 : 2;
				var parts = Math.floor (4 * Math.random ()) + m;

				random = '';
				for (var i = parts; i--;)
				{
					var k = (Math.random() > 0.1) ? 1 : 2;
					var l = Math.floor (k * Math.random ()) + 1;
					for (var j = l; j--;)
					{
						var chars = (coin) ? vowels : consonants;
						var n = Math.floor ((Object.keys (chars).length) * Math.random ());
						random += chars[n];
					};
					coin = (coin) ? false : true;
				};
			break;
		};
		return random;
	},

	scene:
	{
		set next (name)
		{
			game.o = {};
			game.canvas.scene = [];
			game.event.type = 'next';
			game.scene[name] ();
		},

		update: function ()
		{
			switch (game.event.type)
			{
				case 'next':
					//window.log = 'next';
				break;
			};
		}
	},

	update: function (update)
	{
		game.canvas.update ();
		game.object.update ();
		game.scene.update ();
	},

	window:
	{
		load: function ()
		{
			Object.defineProperties
			(
				window,
				{
					'load':
					{
						set: function (load)
						{
							load ();
						}
					},

					'log':
					{
						set: function (message)
						{
							window.console.log (message);
						}
					},

					'ontick':
					{
						set: function (f)
						{
							window.clock = window.setInterval
							(
								function ()
								{
									f ({ tick: window.tick, time: window.time, type: 'tick' });
									window.time += window.tick;
								},
								window.tick
							);
						}
					},

					'tick':
					{
						value: 50,
						writable: true
					},

					'time':
					{
						value: 0,
						writable: true
					}
				}
			);

			window.load = function ()
			{
				window.document.body.style.background = '#000';
				window.document.body.style.margin = 0;
			};

			delete game['window'];

			game.window = window;
		}
	}
};

window.onload = game.load;

game.data.load =
{
	animation:
	{
		run:
		{
			delay: 100,
			frames: [ 'grace_active.svg', 'grace.svg' ],
			loop: true
		}
	},

	audio:
	{
		start: 'start.ogg',
		run: 'run.ogg'
	},

	image:
	{
		logo: 'logo.png',
		grace: 'grace.svg',
		grace_active: 'grace_active.svg',
		grace_press: 'grace_press.svg'
	}
};

game.run = function ()
{
	game.scene.startmenu = function ()
	{
		game.object.create.start.menu = { stars: 90 };
	};

	game.scene.universe = function ()
	{
		game.object.create.universe = {};
	};

	game.scene.galaxy = function ()
	{
		game.player.galaxy.show ();
	};

	game.scene.next = 'startmenu';
};