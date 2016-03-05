require 'sinatra'
require 'json' # added

get '/' do # 'do' statement
  File.read('./views/index.html') # Tip: index will be in top level
end

get '/favorites' do # need /
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

post '/favorites' do # post
  file = JSON.parse(File.read('data.json'))
  unless params[:name] && params[:oid]
    return 'Invalid Request'
  end # end
  movie = { name: params[:name], oid: params[:oid] }
  file[movie[:name]] = movie[:oid]
  File.write('data.json',JSON.pretty_generate(file))
end
