require 'sinatra'
require 'json' # This gem is needed if running older versions of ruby

get '/' do # 'do' should be included at the start of the block 
  # Tip: Make sure the path below matches the location of the index.html file 
  File.read('./views/index.html') 
end

get '/favorites' do # Remember to include the '/'
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end
 
post '/favorites' do # Use POST since data is being submitted
  file = JSON.parse(File.read('data.json'))
  unless params[:name] && params[:oid]
    return 'Invalid Request'
  end # The 'unless' statement requires an 'end'
  movie = { name: params[:name], oid: params[:oid] }
  file[movie[:name]] = movie[:oid]
  File.write('data.json',JSON.pretty_generate(file))
end
