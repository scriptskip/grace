var game =
{
	canvas:
	{
		load: function ()
		{
			var canvas = window.document.createElement ('canvas');
				canvas.context = canvas.getContext ('2d');
				canvas.style.position = 'absolute';
				canvas.redraw = true;

				canvas.autosize = function ()
				{
					this.height = window.innerHeight;
					this.width = window.innerWidth;
				};

				canvas.clear = function ()
				{
					canvas.context.clearRect (0, 0, canvas.width, canvas.height);
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

	set draw (draw)
	{

	},

	event:
	{
		check: function (event)
		{
			game.event.type = event.type;
			game.event.x = event.x;
			game.event.y = event.y;
			game.run = {};
		},

		load: function ()
		{
			game.event.check (event);
			window.onresize = game.event.check;
		}
	},

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
				}
			}
		);

		window.load = function ()
		{
			window.document.body.style.margin = 0;
		};

		game.canvas.load ();
		game.event.load ();
	},

	object:
	{
		create:
		{

		},

		set destroy (destroy)
		{

		}
	},

	set run (run)
	{
		game.update = undefined;
		game.draw = undefined;
	},

	set update (update)
	{
		game.canvas.update ();
	}
};

window.onload = game.load;