import asyncio
import websockets
import json
from threading import Timer

connected = set()


async def server(websocket, path):

    async for message in websocket:
        print(message)
        cmd = json.loads(message)
        if cmd['cmd'] == 'arcade_start':
            dict_data = {
                'cmd': 'event',
                'result': {'event': 'arcade', 'x': 0, 'y': 0, 'w': 200, 'h': 200}
            }
            # dict_data = {
            #     'event': 'flag', 'result': True, 'num_pose': 0, 'image': 'base64ed'
            # }

            await websocket.send(json.dumps(dict_data))
        if cmd['cmd'] == 'arcade_update':
            dict_data = {
                'cmd': 'event',
                'result': cmd['result']
            }
            # dict_data = {
            #     'event': 'flag', 'result': True, 'num_pose': 0, 'image': 'base64ed'
            # }

            await websocket.send(json.dumps(dict_data))

# r = Timer(10.0, nArgs, (websocket, path,3))
# r.start()

start_server = websockets.serve(server, "localhost", 1234)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
