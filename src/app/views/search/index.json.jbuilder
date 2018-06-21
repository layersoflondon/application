# TODO - this needs to return an array of both collection search results AND record search results
json.partial! 'search/search', collection: @records, as: :record
